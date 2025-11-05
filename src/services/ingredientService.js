import Ingredient from "../models/ingredientModel.js";
import { NotFoundError } from "../utils/errors.js";

export class IngredientService {
  async getAllIngredients(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = "-createdAt", fields } = options;

    let query = Ingredient.find(filter);

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

    const ingredients = await query;
    const total = await Ingredient.countDocuments(filter);

    return {
      data: ingredients.map((ingredient) => ({
        ...ingredient.toObject({ virtuals: true }),
        nutritionSummary: ingredient.getNutritionSummary(),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getIngredientById(id) {
    const ingredient = await Ingredient.findById(id).select("-__v");

    if (!ingredient) {
      throw new NotFoundError("Ingrediente");
    }

    return {
      ...ingredient.toObject({ virtuals: true }),
      nutritionSummary: ingredient.getNutritionSummary(),
    };
  }

  async createIngredient(data, userId) {
    return await Ingredient.create({ ...data, user: userId });
  }

  async updateIngredient(id, data) {
    const ingredient = await Ingredient.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!ingredient) {
      throw new NotFoundError("Ingrediente");
    }

    return {
      ...ingredient.toObject({ virtuals: true }),
      nutritionSummary: ingredient.getNutritionSummary(),
    };
  }

  async deleteIngredient(id) {
    const ingredient = await Ingredient.findByIdAndDelete(id);

    if (!ingredient) {
      throw new NotFoundError("Ingrediente");
    }

    return ingredient;
  }
}
