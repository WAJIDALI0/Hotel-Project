import CookModel from "../models/cook_models.js";
import HistoryModel from "../models/history_model.js";
import Product from "../models/product_model.js";
import mongoose from "mongoose";

// Controller to create a product
export const createProduct = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "not authorized" });
  // }
  try {
    const { name, weight, quantity, price, perUnitPrice, dateOfPurchase } = req.body;

    const product = new Product({
      name,
      weight,
      quantity,
      price,
      perUnitPrice,
      dateOfPurchase,
      createdBy: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to get all products with pagination and search functionality
// export const getAllProducts = async (req, res) => {
//   try {
//     const { page = 1, itemsperpage = 10, search = "" } = req.query;
    
//     // Convert page and itemsperpage to integers
//     const pageNumber = parseInt(page);
//     const itemsPerPage = parseInt(itemsperpage);

//     // Create regex for string fields
//     let regex = search ? new RegExp(search, "i") : null;

//     const query = {};

//     // Apply regex only on string fields (name, weight)
//     if (regex) {
//       query.$or = [
//         { name: regex },
//         { weight: regex },
//       ];
//     }

//     // Handle price as a number if the search term is a valid number
//     if (!isNaN(search)) {
//       query.price = parseFloat(search);  // Search for exact price match
//     }

//     const skipItems = (pageNumber - 1) * itemsPerPage;
//     const totalCount = await Product.countDocuments(query);
//     const pages_count = Math.ceil(totalCount / itemsPerPage);

//     const products = await Product.find(query)
//       .skip(skipItems)
//       .limit(itemsPerPage);

//     res.status(200).json({
//       data: products,
//       pages_count,
//       currentPage: pageNumber,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, itemsperpage = 10, search = "" } = req.query;
    
    // Convert page and itemsperpage to integers
    const pageNumber = parseInt(page);
    const itemsPerPage = parseInt(itemsperpage);

    // Create regex for string fields
    let regex = search ? new RegExp(search, "i") : null;

    const query = {};

    // Apply regex only on string fields (name, weight)
    if (regex) {
      query.$or = [
        { name: regex },
        { weight: regex },
      ];
    }

    // Handle price as a number if the search term is a valid number
    if (search && !isNaN(search)) {
      query.price = parseFloat(search);  // Search for exact price match
    }

    const skipItems = (pageNumber - 1) * itemsPerPage;
    const totalCount = await Product.countDocuments(query);
    const pages_count = Math.ceil(totalCount / itemsPerPage);

    const products = await Product.find(query)
      .skip(skipItems)
      .limit(itemsPerPage);

    res.status(200).json({
      data: products,
      pages_count,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Controller to get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get product history
// Correct function definition in your controller
export const getProductHistory = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy")
      .populate({
        path: "history",
        populate: {
          path: "location",
        },
      })
      .populate("manufacturer");

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
  const productId = req.params.id;
  try {
    const { name, weight, quantity, price, perUnitPrice, dateOfPurchase } = req.body;

    await Product.findByIdAndUpdate(productId, {
      name,
      weight,
      quantity,
      price,
      perUnitPrice,
      dateOfPurchase,
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to delete a product by ID
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
