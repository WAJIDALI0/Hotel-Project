import ProductAssignmentLogModel from '../models/showassigned_model.js'; // Import the new log model for assignment
import ProductQuantityUpdateLogModel from '../models/productQuantityUpdateLogSchema.js'; // Import the new log model for inventory updates
import Product from '../models/product_model.js';
import AssignProductCookModel from '../models/assignproductcook_model.js'
import CookModel from '../models/cook_models.js';
export const assignProductToCook = async (req, res) => {
  try {
    const { cook, product, quantity } = req.body;

    const quantityToAdjust = Number(quantity);
    if (isNaN(quantityToAdjust)) {
      return res.status(400).json({ error: "Invalid quantity." });
    }

    if (!cook) {
      return res.status(400).json({ error: "Cook ID is required." });
    }

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Product not found." });
    }

    const cookData = await CookModel.findById(cook);
    if (!cookData) {
      return res.status(404).json({ error: "Cook not found." });
    }

    const existingAssignment = await AssignProductCookModel.findOne({ cook, product });

    if (existingAssignment) {
      const newAssignedQuantity = existingAssignment.quantity + quantityToAdjust;

      if (newAssignedQuantity < 0) {
        return res.status(400).json({ error: "Cook cannot return more than the assigned quantity." });
      }

      existingAssignment.quantity = newAssignedQuantity;
      await existingAssignment.save();

      const previousQuantity = productData.quantity;
      productData.quantity -= quantityToAdjust; // Inventory adjustment
      await productData.save();

      const logEntry = new ProductAssignmentLogModel({
        cook,
        product,
        quantity: quantityToAdjust,
      });
      await logEntry.save();

      const updateLogEntry = new ProductQuantityUpdateLogModel({
        product,
        cook,
        quantity: quantityToAdjust,
        previousQuantity,
        updatedQuantity: productData.quantity,
      });
      await updateLogEntry.save();

      return res.status(200).json({
        success: true,
        data: {
          assignedQuantity: newAssignedQuantity,
          inventoryQuantity: productData.quantity,
          log: logEntry,
        },
      });
    } else if (quantityToAdjust > 0) {
      if (productData.quantity < quantityToAdjust) {
        return res.status(400).json({ error: "Insufficient product quantity." });
      }

      const newAssignment = new AssignProductCookModel({
        cook,
        product,
        quantity: quantityToAdjust,
      });
      await newAssignment.save();

      const previousQuantity = productData.quantity;
      productData.quantity -= quantityToAdjust;
      await productData.save();

      const logEntry = new ProductAssignmentLogModel({
        cook,
        product,
        quantity: quantityToAdjust,
      });
      await logEntry.save();

      const updateLogEntry = new ProductQuantityUpdateLogModel({
        product,
        cook,
        quantity: quantityToAdjust,
        previousQuantity,
        updatedQuantity: productData.quantity,
      });
      await updateLogEntry.save();

      return res.status(201).json({
        success: true,
        data: {
          assignedQuantity: quantityToAdjust,
          inventoryQuantity: productData.quantity,
          log: logEntry,
        },
      });
    } else {
      return res.status(400).json({
        error: "Invalid operation. Cannot assign zero quantity or create a return without an assignment.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsAssignedToCook = async (req, res) => {
  try {
    const assignments = await AssignProductCookModel.aggregate([
      {
        $group: {
          _id: { cook: "$cook", product: "$product" }, // Group by cook and product
          totalQuantity: { $sum: "$quantity" }, // Sum quantities
          latestAssignedDate: { $max: "$createdAt" }, // Get the latest assignment date
        },
      },
      {
        $lookup: {
          from: "cooks",
          localField: "_id.cook",
          foreignField: "_id",
          as: "cookDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          cookName: { $arrayElemAt: ["$cookDetails.name", 0] },
          productName: { $arrayElemAt: ["$productDetails.name", 0] },
          totalQuantity: 1,
          latestAssignedDate: 1,
        },
      },
    ]);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No aggregated assignments found.",
      });
    }

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch aggregated assignments.",
      error: error.message,
    });
  }
};


//    show only 
//  updated
export const getProductQuantityUpdateLog = async (req, res) => {
  try {
    const logs = await ProductQuantityUpdateLogModel.aggregate([
      // Lookup for product details
      {
        $lookup: {
          from: "products", // Join with products collection
          localField: "product", // Reference to the product field in the log model
          foreignField: "_id", // The product ID in the products collection
          as: "productDetails", // Store matched details in 'productDetails'
        },
      },
      // Lookup for cook details
      {
        $lookup: {
          from: "cooks", // Join with cooks collection to get cook's details
          localField: "cook", // Assuming you have a 'cook' field in the log model that refers to the cook
          foreignField: "_id", // The cook ID in the cooks collection
          as: "cookDetails", // Store matched cook details in 'cookDetails'
        },
      },
      // Project the desired fields directly
      {
        $project: {
          productName: { $arrayElemAt: ["$productDetails.name", 0] }, // Get product name
          cookName: { $arrayElemAt: ["$cookDetails.name", 0] }, // Get cook name
          quantity: 1, // Include the quantity in the log
          previousQuantity: 1, // Include previous quantity
          updatedQuantity: 1, // Include updated quantity
          updateDate: 1, // Include update date
        },
      },
      // Optional: Sort by updateDate, if needed (latest first)
      {
        $sort: { updateDate: -1 },
      },
    ]);

    if (!logs || logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product quantity update logs found.",
      });
    }

    res.status(200).json({
      success: true,
      data: logs, // Already formatted in the aggregation pipeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product quantity update logs.",
      error: error.message,
    });
  }
};








// import Product from "../models/product_model.js";

// // const router = express.Router();

// // 1. Assign product to cook
// // export const assignProductToCook = async (req, res) => {
// //   try {
// //     const { cook, product, quantity } = req.body;

// //     // Check if product exists and if enough quantity is available
// //     const productData = await Product.findById(product);
// //     if (!productData || productData.quantity < quantity) {
// //       return res.status(400).json({ error: "Insufficient quantity or product not found." });
// //     }

// //     // Create new assignment for cook
// //     const assignment = new AssignProductCookModel({ cook, product, quantity });
// //     const savedAssignment = await assignment.save();

// //     // Decrease the product quantity after assignment
// //     productData.quantity -= quantity;
// //     await productData.save();

// //     res.status(201).json(savedAssignment);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // };
// // export const assignProductToCook = async (req, res) => {
// //   try {
// //     const { cook, product, quantity } = req.body;

// //     // Check if product exists and if enough quantity is available
// //     const productData = await Product.findById(product);
// //     if (!productData || productData.quantity < quantity) {
// //       return res.status(400).json({ error: "Insufficient quantity or product not found." });
// //     }

// //     // Check if an assignment already exists for the same cook and product
// //     const existingAssignment = await AssignProductCookModel.findOne({ cook, product });

// //     if (existingAssignment) {
// //       // Update the quantity of the existing assignment
// //       const totalQuantity = existingAssignment.quantity + quantity;

// //       // Check if the total quantity after update exceeds available product quantity
// //       if (productData.quantity < totalQuantity) {
// //         return res.status(400).json({ error: "Insufficient quantity for this update." });
// //       }

// //       // Update the assignment's quantity
// //       existingAssignment.quantity = totalQuantity;
// //       await existingAssignment.save();

// //       // Decrease the product quantity after updating the assignment
// //       productData.quantity -= quantity;
// //       await productData.save();

// //       return res.status(200).json(existingAssignment);
// //     } else {
// //       // If no assignment exists, create a new assignment
// //       if (productData.quantity < quantity) {
// //         return res.status(400).json({ error: "Insufficient quantity to create a new assignment." });
// //       }

// //       const assignment = new AssignProductCookModel({ cook, product, quantity });
// //       const savedAssignment = await assignment.save();

// //       // Decrease the product quantity after creating the new assignment
// //       productData.quantity -= quantity;
// //       await productData.save();

// //       return res.status(201).json(savedAssignment);
// //     }
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // };

// export const assignProductToCook = async (req, res) => {
//   try {
//     const { cook, product, quantity } = req.body;  

//     // Ensure quantity is treated as a number
//     const quantityToAssign = Number(quantity);
//     if (isNaN(quantityToAssign) || quantityToAssign <= 0) {
//       return res.status(400).json({ error: "Invalid quantity." });
//     }

//     // Check if product exists and if enough quantity is available
//     const productData = await Product.findById(product);
//     if (!productData || productData.quantity < quantityToAssign) {
//       return res.status(400).json({ error: "Insufficient quantity or product not found." });
//     }

//     // Check if an assignment already exists for the same cook and product
//     const existingAssignment = await AssignProductCookModel.findOne({ cook, product });

//     if (existingAssignment) {
//       // Update the quantity of the existing assignment
//       const totalQuantity = existingAssignment.quantity + quantityToAssign;

//       // Ensure that the updated quantity doesn't exceed available product quantity
//       if (productData.quantity < totalQuantity) {
//         return res.status(400).json({ error: "Insufficient quantity for this update." });
//       }

//       existingAssignment.quantity = totalQuantity;  // Update with correct sum
//       await existingAssignment.save();

//       // Decrease the product quantity after assignment
//       productData.quantity -= quantityToAssign;
//       await productData.save();

//       return res.status(200).json(existingAssignment);
//     } else {
//       // Create a new assignment if none exists
//       const assignment = new AssignProductCookModel({ cook, product, quantity: quantityToAssign });
//       const savedAssignment = await assignment.save();

//       // Decrease the product quantity after assignment
//       productData.quantity -= quantityToAssign;
//       await productData.save();

//       return res.status(201).json(savedAssignment);
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // 2. Get products assigned to cook
// // export const getProductsAssignedToCook = async (req, res) => {
// //   try {
// //     // Check if the user is authenticated
// //     if (!req.user) {
// //       return res.status(401).json({ message: "Login first" });
// //     }

// //     const { cookId } = req.params;
// //     const { page = 1, itemsPerPage = 10, search } = req.query;

// //     // Fetch products assigned to the cook
// //     const assignedProducts = await AssignProductCookModel.find({ cook: cookId })
// //       .populate("product")
// //       .skip((page - 1) * itemsPerPage)
// //       .limit(Number(itemsPerPage));

// //     if (!assignedProducts || assignedProducts.length === 0) {
// //       return res.status(404).json({ message: 'No products found for this cook.' });
// //     }

// //     const totalCount = await AssignProductCookModel.countDocuments({ cook: cookId });

// //     res.status(200).json({
// //       data: assignedProducts,
// //       pages_count: Math.ceil(totalCount / itemsPerPage),
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'An error occurred while fetching products.' });
// //   }
// // };
// // import Product from "../models/product_model.js";
// // import AssignProductCookModel from "../models/assignproductcook_model.js";

// import AssignProductCookModel from "../models/assignproductcook_model.js";
// export const getProductsAssignedToCook = async (req, res) => {
//   try {
//     const assignments = await AssignProductCookModel.aggregate([
//       {
//         $group: {
//           _id: { cook: "$cook", product: "$product" }, // Group by cook and product
//           totalQuantity: { $sum: "$quantity" }, // Sum quantities
//           latestAssignedDate: { $max: "$createdAt" }, // Get the latest assignment date
//         },
//       },
//       {
//         $lookup: {
//           from: "cooks",
//           localField: "_id.cook",
//           foreignField: "_id",
//           as: "cookDetails",
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id.product",
//           foreignField: "_id",
//           as: "productDetails",
//         },
//       },
//       {
//         $project: {
//           cookName: { $arrayElemAt: ["$cookDetails.name", 0] },
//           productName: { $arrayElemAt: ["$productDetails.name", 0] },
//           totalQuantity: 1,
//           latestAssignedDate: 1,
//         },
//       },
//     ]);

//     if (!assignments || assignments.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No aggregated assignments found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: assignments,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch aggregated assignments.",
//       error: error.message,
//     });
//   }
// };


