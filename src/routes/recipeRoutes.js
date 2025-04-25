import express from "express";
import { recipeController } from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(recipeController.createRecipe);

router
.route("/me")
.get(recipeController.getMyRecipes);

router
  .route("/:id")
  .get(recipeController.getRecipeById)
  .put(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);
