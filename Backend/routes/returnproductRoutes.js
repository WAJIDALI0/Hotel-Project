import { returnProductFromCook,getReturnedProducts} from "../controllers/returnproduct_controller.js";
import express from "express";
import { isAuthenticated } from "../middlewares/user_auth.js";
// import { getReturnedProducts } from "../controllers/product_controller.js";

const router = express.Router();

// GET /returnproduct
router.post("/product",isAuthenticated, returnProductFromCook);
router.get("/return",isAuthenticated,getReturnedProducts)
export default router;