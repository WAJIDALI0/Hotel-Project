import CookModel from "../models/cook_models.js";
import Product from "../models/product_model.js";
import ReturnProductModel from "../models/returnproduct.js";
import AssignProductCookModel from "../models/assignproductcook_model.js";

export const returnProductFromCook = async (req, res) => {
  try {
    const { cook, product, quantity } = req.body;
    console.log("Received data:", { cook, product, quantity });

    // Validate and convert quantity to a number
    const returnQuantity = Number(quantity);
    if (isNaN(returnQuantity) || returnQuantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number." });
    }

    // Find the product and cook by their IDs
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Product not found." });
    }
    console.log("Product found:", productData);

    const cookData = await CookModel.findById(cook);
    if (!cookData) {
      return res.status(404).json({ error: "Cook not found." });
    }
    console.log("Cook found:", cookData);

    const assignment = await AssignProductCookModel.findOne({ cook, product });
    if (!assignment || assignment.quantity < returnQuantity) {
      return res.status(400).json({ error: "Invalid return quantity or assignment not found." });
    }
    console.log("Assignment found:", assignment);

    // Update the assigned quantity
    assignment.quantity -= returnQuantity;
    await assignment.save();

    // Update the product quantity in the Product model
    productData.quantity += returnQuantity;
    await productData.save();

    // Save the return details in the ReturnProductModel
    const returnRecord = new ReturnProductModel({
      cook: cookData._id, // Store cook ID for reference
      product: productData._id, // Store product ID for reference
      quantity: returnQuantity,  // Store quantity of returned product
      returnedDate: new Date(),
      cookName: cookData.name || "Unknown Cook", // Store cook name directly
      productName: productData.name || "Unknown Product", // Store product name directly
    });
    await returnRecord.save();

    res.status(200).json({
      message: "Product returned successfully.",
      returnRecord, // Return the saved return record
    });
  } catch (error) {
    console.error("Error in returnProductFromCook:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getReturnedProducts = async (req, res) => {
  try {
    // Fetch all returned products with necessary fields populated
    const returnedProducts = await ReturnProductModel.find()
      .populate("cook", "name") // Populate only the name field of cook
      .populate("product", "name") // Populate only the name field of product
      .select("cook product quantity returnedDate"); // Select the required fields

    if (!returnedProducts.length) {
      return res.status(404).json({ message: "No returned products found." });
    }

    // Respond with returned products data
    res.status(200).json({
      message: "Returned products retrieved successfully",
      returnedProducts,
    });
  } catch (error) {
    console.error("Error fetching returned products:", error);
    res.status(500).json({ error: error.message });
  }
};

