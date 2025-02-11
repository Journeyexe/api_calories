import Ingredient from "../models/ingredientModel.js";
import { logger } from "../config/logger.js";

export const ingredientController = {
  async getAllIngredient(req, res, next) {
    try {
      const ingredients = await Ingredient.find().select("-__v");

      // Inclui caloriesFromFat virtual no response
      const ingredientsWithVirtuals = ingredients.map((ingredient) => ({
        ...ingredient.toObject({ virtuals: true }),
        nutritionSummary: ingredient.getNutritionSummary(),
      }));

      res.status(200).json({
        success: true,
        count: ingredients.length,
        data: ingredientsWithVirtuals,
      });
    } catch (error) {
      next(error);
    }
  },

  async getIngredientById(req, res, next) {
    try {
      const { id } = req.params;
      const ingredient = await Ingredient.findById(id).select("-__v");

      if (!ingredient) {
        return res.status(404).json({
          success: false,
          error: "Ingrediente não encontrado",
        });
      }

      const response = {
        ...ingredient.toObject({ virtuals: true }),
        nutritionSummary: ingredient.getNutritionSummary(),
      };

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async createIngredient(req, res, next) {
    try {
      const ingredient = await Ingredient.create(req.body);

      // Inclui informações adicionais no response
      const response = {
        ...ingredient.toObject({ virtuals: true }),
        nutritionSummary: ingredient.getNutritionSummary(),
      };

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({
          success: false,
          error: "Um alimento com este nome já existe",
        });
      }
      next(error);
    }
  },

  // Método adicional para buscar por faixa de calorias
  async getIngredientByCaloriesRange(req, res, next) {
    try {
      const { min, max } = req.query;
      const ingredients = await Ingredient.findByCaloriesRange(
        parseInt(min) || 0,
        parseInt(max) || 1000
      );

      res.status(200).json({
        success: true,
        count: ingredients.length,
        data: ingredients,
      });
    } catch (error) {
      next(error);
    }
  },
};
