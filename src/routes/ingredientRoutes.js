import express from "express";
import { ingredientController } from "../controllers/ingredientController.js";

export const router = express.Router();

router
  .route("/")
  .get(ingredientController.getAllIngredient)
  .post(ingredientController.createIngredient);

router.get(
  "/calories-range",
  ingredientController.getIngredientByCaloriesRange
);

router.get("/:id", ingredientController.getIngredientById);