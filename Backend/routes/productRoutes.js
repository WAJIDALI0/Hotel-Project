import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductHistory,  // Corrected to 'getProductHistory'
} from "../controllers/product_controller.js";  // Ensure the correct function is imported
import { isAuthenticated } from "../middlewares/user_auth.js";

const productRouter = express.Router();

// Create a new product
productRouter.post("/", isAuthenticated, createProduct);
// cook


// Get all products
productRouter.get("/", getAllProducts);


// import {
//   addProduct,
//   getProducts,
// } from "../controllers/product_controller.js";


// Product routes
// productRouter.post("/products",isAuthenticated, addProduct);
// productRouter.get("/products", getProducts);
import { getReturnedProducts } from "../controllers/product_controller.js";
// Assign product routes
productRouter.get("/returned-products", getReturnedProducts);
// Return product routes







    
// Define route to get product history (corrected import)
productRouter.get("/:id/history", getProductHistory);  // Use the correct handler

// Get a single product by ID
productRouter.get("/:id", getProductById);

// Update a product by ID
productRouter.put("/:id", isAuthenticated, updateProductById);

// Delete a product by ID
productRouter.delete("/:id", isAuthenticated, deleteProductById);

// Export the product routes
export default productRouter;
