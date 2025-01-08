import { assignProductToCook, getProductsAssignedToCook,  } from "../controllers/AssignProduct_controller.js";
import express from "express"; 
import { isAuthenticated } from "../middlewares/user_auth.js";

const router =express.Router()

router.post("/product", (req, res, next) => {
    console.log("Request body:", req.body);
    next();
  }, isAuthenticated, assignProductToCook);
router.get("/products", isAuthenticated, getProductsAssignedToCook);
router.get("/unupdate",isAuthenticated,getProductsAssignedToCook)

  

export default router;