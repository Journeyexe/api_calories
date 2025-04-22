import Recipe from "../models/recipeModel.js";
import { logger } from "../config/logger.js";

export const recipeController = {
  async getAllRecipes(req, res, next) {
    try {
      const recipes = await Recipe.find().populate({
        path: "ingredients.ingredientId",
        select: "name calories", // Seleciona apenas nome e calorias do ingrediente
      });

      res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes.reverse(),
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserRecipes(req, res, next) {
    try {
      const recipes = await Recipe.find({ user: req.user.id }).populate({
        path: "ingredients.ingredientId",
        select: "name calories", // Seleciona apenas nome e calorias do ingrediente
      });

      res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes.reverse(),
      });
    } catch (error) {
      next(error);
    }
  },

  async createRecipe(req, res, next) {
    try {
      const recipe = await Recipe.create({
        ...req.body,
        user: req.user.id, // Adiciona o ID do usuário
      });

      // Popular ingredientes após criar
      await recipe.populate({
        path: "ingredients.ingredientId",
        select: "name calories",
      });

      res.status(201).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: "Uma receita com este nome já existe",
        });
      }
      next(error);
    }
  },

  async getRecipeById(req, res, next) {
    try {
      const recipe = await Recipe.findById(req.params.id).populate({
        path: "ingredients.ingredientId",
        select: "name calories",
      });

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: "Receita não encontrada",
        });
      }

      res.status(200).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateRecipe(req, res, next) {
    try {
      const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate({
        path: "ingredients.ingredientId",
        select: "name calories",
      });

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: "Receita não encontrada",
        });
      }

      res.status(200).json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteRecipe(req, res, next) {
    try {
      const recipe = await Recipe.findByIdAndDelete(req.params.id);

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: "Receita não encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message: "Receita deletada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  },
};
