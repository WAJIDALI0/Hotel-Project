import mongoose from "mongoose";
import CookModel from "../models/cook_models.js";
import AssignCookProduct from "../models/assignproductcook.js";

export const addCook = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a cook with the same name already exists
    const existingCook = await CookModel.findOne({ name });
    if (existingCook) {
      return res.status(400).json({ message: "This name user exists" });
    }

    // If not, create a new cook
    const newCook = new CookModel({
      name,
      // createdBy,
    });

    await newCook.save();

    res.status(201).json({ message: "Cook created successfully", data: newCook });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "This name user exists" });
    }

    res.status(500).json({ error: error.message });
  }
};

// app.post('/api/v1/cooks/assign', async (req, res) => {
//   try {
//       const { cookname, productname, quantity, dateOfPurchase } = req.body;

//       // Validate fields
//       if (!cookname || !productname || !quantity || !dateOfPurchase) {
//           return res.status(400).json({ message: 'All fields are required.' });
//       }

//       // Add assignment logic here, e.g., saving to the database
//       const assignedProduct = await AssignProductCookModel.create({
//           cook: cookname, // Ensure this is mapped correctly to ObjectId if needed
//           product: productname, // Ensure this is mapped correctly to ObjectId if needed
//           quantity,
//           assignedDate: dateOfPurchase,
//       });

//       res.status(201).json({ message: 'Product assigned successfully', data: assignedProduct });
//   } catch (error) {
//       console.error('Error in assigning product:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

export const assignProduct= async (req, res) => {
  try {
    //  we check if product, quantity, cook, assignedDate are provided or not
const { cook,product,quantity , assignedDate,} = req.body;
const existingCookproduct = await AssignCookProduct.findOne({cook, product, quantity , assignedDate });
    if (existingCookproduct) {
      return res.status(400).json({ message: "This product already assign" });
    }
    const assignProduct = new AssignCookProduct({
      cook,
      product,
      quantity,
      assignedDate,
  
    });
    await assignProduct.save();
    res.status(201).json({ message: "Product assigned successfully", data: assignProduct });
  }
  catch (error) {
    // Handle duplicate key error
    // if (error.code === 11000) {
      // return res.status(400).json({ message: "This product already assign" });
    // }
  
    res.status(500).json({ error: error.message });
  }
  
  };
//  if these products assign then we show the message that 
// 
//  if (product) {
//     return res.status(400).json({ message: "This product already assign" });
//   }
//   if (quantity) {
//     return res.status(400).json({ message: "This quantity already assign" });
//   }
//   if (cook) {
 //     return res.status(400).json({ message: "This cook already assign" });
  //   }
  //   if (assignedDate) {
  //     return res.status(400).json({ message: "This date already assign" });
  //   }
  //   if (completedDate) {
  //     return res.status(400).json({ message: "This date already assign" });

//   // If not, create a new product
   

// export const deleteAssignedProduct = async (req, res) => {  
//   try {
//     const assignProduct = await AssignCookProduct.findByIdAndDelete(req.params.id);
//     if (!assignProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export const getAssignedProducts = async (req, res) => {
//   try {
//     const assignProduct = await AssignCookProduct.find();
//     res.status(200).json(assignProduct);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// }

// export const getAssignedProduct = async (req, res) => {
//   try {
//     const assignProduct = await AssignCookProduct.findById(req.params.id);
//     if (!assignProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(assignProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export const updateAssignedProduct = async (req, res) => {
//   try {
//     const { product, quantity, cook, assignedDate } = req.body;
//     const assignProduct = await AssignCookProduct.findById(req.params.id);
//     if (!assignProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     assignProduct.product = product;
//     assignProduct.quantity = quantity;
//     assignProduct.cook = cook;
//     assignProduct.assignedDate = assignedDate;

//     await assignProduct.save();
//     res.status(200).json({ message: "Product updated successfully", data: assignProduct });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export const deleteAssignedProduct = async (req, res) => {
//   try {
//     const assignProduct = await AssignCookProduct.findById(req.params.id);
//     if (!assignProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     await assignProduct.remove();
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export default { addCook, assinProduct, getAssignedProducts, getAssignedProduct, updateAssignedProduct, deleteAssignedProduct };

// // import mongoose from "mongoose";
