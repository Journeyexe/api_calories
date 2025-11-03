import { IngredientService } from "../services/ingredientService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../config/logger.js";
import Ingredient from "../models/ingredientModel.js";

const ingredientService = new IngredientService();

export const ingredientController = {
  getAllIngredients: asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sort, fields } = req.query;

    const result = await ingredientService.getAllIngredients(
      {},
      {
        page,
        limit,
        sort,
        fields,
      }
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data.sort((a, b) => a.name.localeCompare(b.name)),
      pagination: result.pagination,
    });
  }),

  getMyIngredients: asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sort, fields } = req.query;

    const result = await ingredientService.getAllIngredients(
      { user: req.user.id },
      { page, limit, sort, fields }
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data.sort((a, b) => a.name.localeCompare(b.name)),
      pagination: result.pagination,
    });
  }),

  getIngredientById: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ingredient = await ingredientService.getIngredientById(id);

    res.status(200).json({
      success: true,
      data: ingredient,
    });
  }),

  createIngredient: asyncHandler(async (req, res, next) => {
    const ingredient = await ingredientService.createIngredient(
      req.body,
      req.user.id
    );

    const response = {
      ...ingredient.toObject({ virtuals: true }),
      nutritionSummary: ingredient.getNutritionSummary(),
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  }),

  updateIngredient: asyncHandler(async (req, res, next) => {
    const ingredient = await ingredientService.updateIngredient(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: ingredient,
    });
  }),

  deleteIngredient: asyncHandler(async (req, res, next) => {
    await ingredientService.deleteIngredient(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ingrediente deletado com sucesso",
    });
  }),

  getIngredientByCaloriesRange: asyncHandler(async (req, res, next) => {
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
  }),
};
