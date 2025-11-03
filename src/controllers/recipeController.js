import { RecipeService } from "../services/recipeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../config/logger.js";

const recipeService = new RecipeService();

export const recipeController = {
  getAllRecipes: asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sort, fields } = req.query;

    const result = await recipeService.getAllRecipes(
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

  getMyRecipes: asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sort, fields } = req.query;

    const result = await recipeService.getAllRecipes(
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

  createRecipe: asyncHandler(async (req, res, next) => {
    const recipe = await recipeService.createRecipe(
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(201).json({
      success: true,
      data: recipe,
    });
  }),

  getRecipeById: asyncHandler(async (req, res, next) => {
    const recipe = await recipeService.getRecipeById(req.params.id);

    res.status(200).json({
      success: true,
      data: recipe,
    });
  }),

  updateRecipe: asyncHandler(async (req, res, next) => {
    const recipe = await recipeService.updateRecipe(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: recipe,
    });
  }),

  deleteRecipe: asyncHandler(async (req, res, next) => {
    await recipeService.deleteRecipe(req.params.id);

    res.status(200).json({
      success: true,
      message: "Receita deletada com sucesso",
    });
  }),
};
