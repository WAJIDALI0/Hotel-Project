import Product from "../models/product_model.js";

// const router = express.Router();

// 1. Assign product to cook
// export const assignProductToCook = async (req, res) => {
//   try {
//     const { cook, product, quantity } = req.body;

//     // Check if product exists and if enough quantity is available
//     const productData = await Product.findById(product);
//     if (!productData || productData.quantity < quantity) {
//       return res.status(400).json({ error: "Insufficient quantity or product not found." });
//     }

//     // Create new assignment for cook
//     const assignment = new AssignProductCookModel({ cook, product, quantity });
//     const savedAssignment = await assignment.save();

//     // Decrease the product quantity after assignment
//     productData.quantity -= quantity;
//     await productData.save();

//     res.status(201).json(savedAssignment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// export const assignProductToCook = async (req, res) => {
//   try {
//     const { cook, product, quantity } = req.body;

//     // Check if product exists and if enough quantity is available
//     const productData = await Product.findById(product);
//     if (!productData || productData.quantity < quantity) {
//       return res.status(400).json({ error: "Insufficient quantity or product not found." });
//     }

//     // Check if an assignment already exists for the same cook and product
//     const existingAssignment = await AssignProductCookModel.findOne({ cook, product });

//     if (existingAssignment) {
//       // Update the quantity of the existing assignment
//       const totalQuantity = existingAssignment.quantity + quantity;

//       // Check if the total quantity after update exceeds available product quantity
//       if (productData.quantity < totalQuantity) {
//         return res.status(400).json({ error: "Insufficient quantity for this update." });
//       }

//       // Update the assignment's quantity
//       existingAssignment.quantity = totalQuantity;
//       await existingAssignment.save();

//       // Decrease the product quantity after updating the assignment
//       productData.quantity -= quantity;
//       await productData.save();

//       return res.status(200).json(existingAssignment);
//     } else {
//       // If no assignment exists, create a new assignment
//       if (productData.quantity < quantity) {
//         return res.status(400).json({ error: "Insufficient quantity to create a new assignment." });
//       }

//       const assignment = new AssignProductCookModel({ cook, product, quantity });
//       const savedAssignment = await assignment.save();

//       // Decrease the product quantity after creating the new assignment
//       productData.quantity -= quantity;
//       await productData.save();

//       return res.status(201).json(savedAssignment);
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const assignProductToCook = async (req, res) => {
  try {
    const { cook, product, quantity } = req.body;  

    // Ensure quantity is treated as a number
    const quantityToAssign = Number(quantity);
    if (isNaN(quantityToAssign) || quantityToAssign <= 0) {
      return res.status(400).json({ error: "Invalid quantity." });
    }

    // Check if product exists and if enough quantity is available
    const productData = await Product.findById(product);
    if (!productData || productData.quantity < quantityToAssign) {
      return res.status(400).json({ error: "Insufficient quantity or product not found." });
    }

    // Check if an assignment already exists for the same cook and product
    const existingAssignment = await AssignProductCookModel.findOne({ cook, product });

    if (existingAssignment) {
      // Update the quantity of the existing assignment
      const totalQuantity = existingAssignment.quantity + quantityToAssign;

      // Ensure that the updated quantity doesn't exceed available product quantity
      if (productData.quantity < totalQuantity) {
        return res.status(400).json({ error: "Insufficient quantity for this update." });
      }

      existingAssignment.quantity = totalQuantity;  // Update with correct sum
      await existingAssignment.save();

      // Decrease the product quantity after assignment
      productData.quantity -= quantityToAssign;
      await productData.save();

      return res.status(200).json(existingAssignment);
    } else {
      // Create a new assignment if none exists
      const assignment = new AssignProductCookModel({ cook, product, quantity: quantityToAssign });
      const savedAssignment = await assignment.save();

      // Decrease the product quantity after assignment
      productData.quantity -= quantityToAssign;
      await productData.save();

      return res.status(201).json(savedAssignment);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Get products assigned to cook
// export const getProductsAssignedToCook = async (req, res) => {
//   try {
//     // Check if the user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: "Login first" });
//     }

//     const { cookId } = req.params;
//     const { page = 1, itemsPerPage = 10, search } = req.query;

//     // Fetch products assigned to the cook
//     const assignedProducts = await AssignProductCookModel.find({ cook: cookId })
//       .populate("product")
//       .skip((page - 1) * itemsPerPage)
//       .limit(Number(itemsPerPage));

//     if (!assignedProducts || assignedProducts.length === 0) {
//       return res.status(404).json({ message: 'No products found for this cook.' });
//     }

//     const totalCount = await AssignProductCookModel.countDocuments({ cook: cookId });

//     res.status(200).json({
//       data: assignedProducts,
//       pages_count: Math.ceil(totalCount / itemsPerPage),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while fetching products.' });
//   }
// };
// import Product from "../models/product_model.js";
// import AssignProductCookModel from "../models/assignproductcook_model.js";

import AssignProductCookModel from "../models/assignproductcook_model.js";
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






// export const getProductsAssignedToCook =async (req, res) => {
//   const { page = 1, itemsPerPage = 10, search = '' } = req.query;
//   const cookId = req.params.cookId;

//   // Validate cookId
//   if (!mongoose.Types.ObjectId.isValid(cookId)) {
//     return res.status(400).json({ error: "Invalid cook ID" });
//   }

//   // Convert pagination parameters to integers
//   const pageNumber = parseInt(page, 10);
//   const itemsPerPageNumber = parseInt(itemsPerPage, 10);

//   try {
//     // Create search filter if search term exists
//     const searchFilter = search ? { "product.name": { $regex: search, $options: 'i' } } : {};

//     // Find products assigned to the specific cook, with pagination and search filter
//     const products = await Product.find({
//       cook: cookId,
//       ...searchFilter, // Add the search filter to the query if a search term exists
//     })
//       .skip((pageNumber - 1) * itemsPerPageNumber)  // Skip items for pagination
//       .limit(itemsPerPageNumber);  // Limit items per page

//     // Get the total count of products matching the criteria
//     const totalCount = await Product.countDocuments({
//       cook: cookId,
//       ...searchFilter,
//     });

//     // Calculate total number of pages
//     const totalPages = Math.ceil(totalCount / itemsPerPageNumber);

//     // Return the products and pagination data
//     res.json({
//       data: products,
//       pages_count: totalPages,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred while fetching products." });
//   }
// });

// Define routes
// router.post("/assign/product", isAuthenticated, assignProductToCook);
// router.get("/product/:cookId", isAuthenticated, getProductsAssignedToCook);

// export default router;
