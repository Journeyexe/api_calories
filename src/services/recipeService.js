import Recipe from "../models/recipeModel.js";
import Ingredient from "../models/ingredientModel.js";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors.js";

export class RecipeService {
  async getAllRecipes(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = "-createdAt", fields } = options;

    let query = Recipe.find(filter).populate(
      "ingredients.ingredientId",
      "name calories protein carbs fat"
    );

    if (fields) {
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    if (sort) {
      query = query.sort(sort);
    }

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const recipes = await query;
    const total = await Recipe.countDocuments(filter);

    return {
      data: recipes.map((recipe) => ({
        ...recipe.toObject({ virtuals: true }),
        nutrition: recipe.calculateNutrition(),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getRecipeById(id) {
    const recipe = await Recipe.findById(id)
      .populate("ingredients.ingredientId", "name calories protein carbs fat")
      .select("-__v");

    if (!recipe) {
      throw new NotFoundError("Receita");
    }

    return {
      ...recipe.toObject({ virtuals: true }),
      nutrition: recipe.calculateNutrition(),
    };
  }

  async validateIngredients(ingredients, userId, userRole) {
    const ingredientIds = ingredients.map((i) => i.ingredientId);
    const foundIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });

    if (foundIngredients.length !== ingredientIds.length) {
      throw new ValidationError("Um ou mais ingredientes não encontrados");
    }

    // Verificar se usuário tem acesso aos ingredientes
    const hasUnauthorizedIngredient = foundIngredients.some(
      (ing) => ing.user.toString() !== userId && userRole !== "admin"
    );

    if (hasUnauthorizedIngredient) {
      throw new ForbiddenError(
        "Você não tem permissão para usar alguns ingredientes"
      );
    }

    return foundIngredients;
  }

  async createRecipe(data, userId, userRole) {
    // Validar ingredientes
    await this.validateIngredients(data.ingredients, userId, userRole);

    const recipe = await Recipe.create({
      ...data,
      user: userId,
    });

    return await recipe.populate(
      "ingredients.ingredientId",
      "name calories protein carbs fat"
    );
  }

  async updateRecipe(id, data, userId, userRole) {
    // Validar ingredientes se fornecidos
    if (data.ingredients) {
      await this.validateIngredients(data.ingredients, userId, userRole);
    }

    const recipe = await Recipe.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("ingredients.ingredientId", "name calories protein carbs fat")
      .select("-__v");

    if (!recipe) {
      throw new NotFoundError("Receita");
    }

    return recipe;
  }

  async deleteRecipe(id) {
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      throw new NotFoundError("Receita");
    }

    return recipe;
  }
}
