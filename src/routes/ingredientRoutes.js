import express from "express";
import { ingredientController } from "../controllers/ingredientController.js";
import { protect } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(ingredientController.getAllIngredient)
  .get(ingredientController.getUserIngredient)
  .post(ingredientController.createIngredient);

router.get(
  "/calories-range",
  ingredientController.getIngredientByCaloriesRange
);

router.get("/:id", ingredientController.getIngredientById);
