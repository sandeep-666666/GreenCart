import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

//add product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resourse_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imagesUrl });

    res.json({
      success: true,
      message: "Products added",
    });
  } catch (error) {
    console.log("Error occured while adding products");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get product: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res.status(400).json({
        success: false,
        message: "Products not found",
      });
    }
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Error occured while getting products");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Id is required",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Fetched successfully",
      Product,
    });
  } catch (error) {
    console.log("Error occured while getting single product");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//change product in stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    await Product.findByIdAndUpdate(id, { inStock });
    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.log("Error occured while updating stock");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller: productCategory
export const productCategory = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); // fetch unique categories
    if (!categories.length) {
      return res.status(404).json({
        success: false,
        message: "No product categories found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log("Error while fetching product categories:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
