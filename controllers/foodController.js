import Food from "../models/foodModel.js";
import { logger } from "../config/logger.js";

export const foodController = {
  async getAllFood(req, res, next) {
    try {
      const foods = await Food.find().select("-__v");

      // Inclui caloriesFromFat virtual no response
      const foodsWithVirtuals = foods.map((food) => ({
        ...food.toObject({ virtuals: true }),
        nutritionSummary: food.getNutritionSummary(),
      }));

      res.status(200).json({
        success: true,
        count: foods.length,
        data: foodsWithVirtuals,
      });
    } catch (error) {
      next(error);
    }
  },

  async createFood(req, res, next) {
    try {
      const food = await Food.create(req.body);

      // Inclui informações adicionais no response
      const response = {
        ...food.toObject({ virtuals: true }),
        nutritionSummary: food.getNutritionSummary(),
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
  async getFoodByCaloriesRange(req, res, next) {
    try {
      const { min, max } = req.query;
      const foods = await Food.findByCaloriesRange(
        parseInt(min) || 0,
        parseInt(max) || 1000
      );

      res.status(200).json({
        success: true,
        count: foods.length,
        data: foods,
      });
    } catch (error) {
      next(error);
    }
  },
};
