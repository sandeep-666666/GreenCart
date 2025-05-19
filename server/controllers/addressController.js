import Address from "../models/Address.js";

//add address : /api/address/add

export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    if (!address || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    await Address.create({ ...address, userId });
    return res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log("Error occured while adding address", error.message);
    return res.status(500).json({
      success: true,
      message: "Unable to add address please try again later",
    });
  }
};

//get address : /api/address/get

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "userid is required",
      });
    }
    const addresses = await Address.find({ userId });
    if (!addresses) {
      return res.status(401).json({
        success: false,
        message: " Unable to get all the addresses",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All the addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.log("Error occured while fetching all address", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch all the addresses please try again later",
    });
  }
};
