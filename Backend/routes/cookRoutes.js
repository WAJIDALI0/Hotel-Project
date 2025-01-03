import { addCook, assignProduct } from "../controllers/cook_controller.js";
import { isAuthenticated } from "../middlewares/user_auth.js";
import express from "express";

const cookRouter = express.Router();

cookRouter.post("/cook", isAuthenticated, addCook);
cookRouter.post("/assign", isAuthenticated, assignProduct);

export default cookRouter;
