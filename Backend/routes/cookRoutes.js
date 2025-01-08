import { addCook,getAllCooks} from "../controllers/Addcook_controller.js";
import { isAuthenticated } from "../middlewares/user_auth.js";
import express, { Router } from "express";

const router = express.Router();

router.post("/cook", isAuthenticated, addCook);
router.get('/cooks',isAuthenticated,getAllCooks)
// router.post("/assign", isAuthenticated, assignProduct);


// export default cookRouter;



// import express from "express";
import {
  getAllAssignments,
  getAllReturns,
  getAssignmentsByCook,
  getReturnsByCook,
} from "../controllers/product_controller.js";




// Get all products assigned to a specific cook


// const router = express.Router();

// Get all product assignments
router.get("/assignments", getAllAssignments);

// Get all product returns
router.get("/returns", getAllReturns);

// Get assignments for a specific cook
router.get("/assignments/cook/:cookId", getAssignmentsByCook);
// import { getAllCooks } from "../controllers/Addcook_controller.js";


// Fetch all cooks
router.get("/cooks", getAllCooks);


// Get returns for a specific cook
router.get("/returns/cook/:cookId", getReturnsByCook);

export default router;

