import express from "express";
import { recipeController } from "../controllers/recipeController.js";

export const router = express.Router();

router
  .route("/")
  .get(recipeController.getAllRecipes)
  .post(recipeController.createRecipe);

router
  .route("/:id")
  .get(recipeController.getRecipeById)
  .put(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);
