import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import "dotenv/config";
import User from "../models/User.js";

//Place order stripe:/api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;
    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    let productData = [];

    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    //adding tax charge
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    //Stripe gateway initialise
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //create line items for stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "aud",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    //create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Error occured while placing order");
    console.log("Error Stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Unable to place order please try again later",
    });
  }
};

//Stripe webhooks to verify Payments Action: /stripe
export const stripeWebhooks = async (req, res) => {
  //stripe getway initialise
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error ${error.message}`);
  }

  //hendle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;

      //mark payment as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      //clear the cart data
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  res.json({ received: true });
};

//place order COD : api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }
    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    //adding tax charge
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log("Error occured while placing order");
    return res.status(500).json({
      success: false,
      message: "Unable to place order please try again later",
    });
  }
};

//get orders by userid : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    if (!orders) {
      return res.status(401).json({
        success: false,
        message: "Unable to get order by userid",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Fetched order successfully by userid",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch order by userid please try again later",
    });
  }
};

//get all orders (for seller / admin ) : api/order/seller
export const getALlOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Fetched all the orders successfully",
      orders: orders || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch all the orders please try again later",
    });
  }
};

//update status of order for seller: api/seller/update
export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
