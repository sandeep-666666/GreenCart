import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { currency, axios } = useAppContext();

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/order/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchOrders(); // refresh orders
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 overflow-y-scroll flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            {/* ✅ Product List */}
            <div className="flex gap-5 max-w-80">
              <div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <img
                      className="w-12 h-12 object-cover"
                      src={item.product.image[0]}
                      alt="Product"
                    />
                    <p className="font-medium">
                      {item.product.name}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Address */}
            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.zipcode},{" "}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* ✅ Amount */}
            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            {/* ✅ Payment & Status */}
            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>

              {/* ✅ Dropdown for Status Update */}
              <label className="mt-2">
                Status:{" "}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border p-1 rounded"
                >
                  <option value="order placed">Order Placed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
