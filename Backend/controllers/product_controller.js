import CookModel from "../models/cook_models.js";
import HistoryModel from "../models/history_model.js";
import Product from "../models/product_model.js";
import mongoose from "mongoose";
import ReturnProductModel from "../models/returnproduct.js";

// Controller to create a product
export const createProduct = async (req, res) => {
  try {
    const { name, weight, quantity, price, perUnitPrice, dateOfPurchase } = req.body;

    if (!name || !weight || !quantity || !price || !perUnitPrice || !dateOfPurchase) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the product already exists
    let product = await Product.findOne({ name });

    if (product) {
      // If the product exists, add the returned quantity to the existing product's quantity
      product.quantity += quantity;
      await product.save();
      return res.status(200).json({
        message: "Product already exists, updated quantity with returned product.",
        product
      });
    } else {
      // If the product doesn't exist, create a new product
      product = new Product({
        name,
        weight,
        quantity,
        price,
        perUnitPrice,
        dateOfPurchase,
        createdBy: req.user._id,
      });

      await product.save();
      res.status(201).json({ message: "Product created successfully", product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller to get all products with pagination and search functionality
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, itemsperpage = 10, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(itemsperpage);

    const regex = search.trim() ? new RegExp(search, "i") : null;
    const query = {};

    if (regex) {
      query.$or = [{ name: regex }, { weight: regex }];
    }

    if (search && !isNaN(search)) {
      query.price = parseFloat(search);
    }

    const totalCount = await Product.countDocuments(query);
    const pagesCount = Math.ceil(totalCount / itemsPerPage);
    const products = await Product.find(query)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json({
      data: products,
      totalProducts: totalCount,
      pagesCount,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get product history
export const getProductHistory = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate({
        path: "history",
        populate: { path: "location", select: "name address" },
      })
      .populate("manufacturer", "name contact");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update product details
export const updateProductById = async (req, res) => {
  try {
    const { name, weight, quantity, price, perUnitPrice, dateOfPurchase } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, weight, quantity, price, perUnitPrice, dateOfPurchase },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a product by ID
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnProductModel.find()
      .populate("cook", "name") // Populate cook's name
      .populate("product", "name"); // Populate product's name

    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import AssignProductCookModel from "../models/assignproductcook_model.js";

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignProductCookModel.find()
      .populate("cook", "name") // Populate cook's name
      .populate("product", "name"); // Populate product's name

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAssignmentsByCook = async (req, res) => {
  try {
    const { cookId } = req.params;

    const assignments = await AssignProductCookModel.find({ cook: cookId })
      .populate("cook", "name")
      .populate("product", "name");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getReturnsByCook = async (req, res) => {
  try {
    const { cookId } = req.params;

    const returns = await ReturnProductModel.find({ cook: cookId })
      .populate("cook", "name")
      .populate("product", "name");

    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getReturnedProducts = async (req, res) => {
  try {
    const returnedProducts = await ReturnProductModel.find()
      .populate("cook", "name")
      .populate("product", "name")
      .select("cook product returnedQuantity returnDate");

    if (!returnedProducts || returnedProducts.length === 0) {
      return res.status(404).json({ message: "No returned products found." });
    }

    res.status(200).json(returnedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



