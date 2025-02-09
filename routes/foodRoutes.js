import express from "express";
import { foodController } from "../controllers/foodController.js";

export const router = express.Router();

router
  .route("/")
  .get(foodController.getAllFood)
  .post(foodController.createFood);

router.get("/calories-range", foodController.getFoodByCaloriesRange);
