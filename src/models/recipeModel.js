import { Schema } from "mongoose";
import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";
import sanitize from "mongoose-sanitize";
import Ingredient from "./ingredientModel.js";

const recipeIngredientSchema = new Schema({
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  measure: {
    type: Number,
    required: [true, "Measure is required"],
    min: [0, "Measure must be at least 0"],
  },
});

const recipeSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  recipeWeight: {
    type: Number,
    min: [0, "Weight must be at least 0"],
  },
  calories: {
    type: Number,
    min: [0, "Calories must be at least 0"],
  },
  carbohydrate: {
    type: Number,
    min: [0, "Carbohydrate must be at least 0"],
  },
  protein: {
    type: Number,
    min: [0, "Protein must be at least 0"],
  },
  totalFat: {
    type: Number,
    min: [0, "Total Fat must be at least 0"],
  },
  saturatedFat: {
    type: Number,
    min: [0, "Saturated Fat must be at least 0"],
  },
  fiber: {
    type: Number,
    min: [0, "Fiber must be at least 0"],
  },
  sodium: {
    type: Number,
    min: [0, "Sodium must be at least 0"],
  },
  description: {
    type: String,
    trim: true,
  },
  ingredients: [recipeIngredientSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Add timestamps plugin
recipeSchema.plugin(timestamps);

// Add sanitize plugin
recipeSchema.plugin(sanitize);

// Índices para melhorar performance de queries
recipeSchema.index({ name: 1 });
recipeSchema.index({ user: 1, name: 1 });

// Pre-save hook to normalize name and calculate nutritional values
recipeSchema.pre("save", async function (next) {
  this.name = this.name.trim().toLowerCase();

  let totalRecipeWeight = 0;
  let totalCalories = 0;
  let totalCarbohydrate = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalSaturatedFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;

  for (const ingredient of this.ingredients) {
    const ingredientData = await Ingredient.findById(ingredient.ingredientId);
    if (!ingredientData) {
      return next(
        new Error(
          `Ingredient with ID ${ingredient.ingredientId} does not exist`
        )
      );
    }
    const measureFactor = ingredient.measure / 100;
    totalRecipeWeight += ingredient.measure;
    totalCalories += ingredientData.calories * measureFactor;
    totalCarbohydrate += ingredientData.carbohydrate * measureFactor;
    totalProtein += ingredientData.protein * measureFactor;
    totalFat += ingredientData.totalFat * measureFactor;
    totalSaturatedFat += ingredientData.saturatedFat * measureFactor;
    totalFiber += ingredientData.fiber * measureFactor;
    totalSodium += ingredientData.sodium * measureFactor;
  }

  this.recipeWeight = totalRecipeWeight;
  this.calories = totalCalories;
  this.carbohydrate = totalCarbohydrate;
  this.protein = totalProtein;
  this.totalFat = totalFat;
  this.saturatedFat = totalSaturatedFat;
  this.fiber = totalFiber;
  this.sodium = totalSodium;

  next();
});

// Pre-update hook for findOneAndUpdate to recalculate nutritional values
recipeSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Só recalcular se houver alteração nos ingredientes
  if (update.ingredients || update.$set?.ingredients) {
    const ingredients = update.ingredients || update.$set?.ingredients;

    if (!ingredients || ingredients.length === 0) {
      return next();
    }

    let totalRecipeWeight = 0;
    let totalCalories = 0;
    let totalCarbohydrate = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalSaturatedFat = 0;
    let totalFiber = 0;
    let totalSodium = 0;

    for (const ingredient of ingredients) {
      const ingredientData = await Ingredient.findById(ingredient.ingredientId);
      if (!ingredientData) {
        return next(
          new Error(
            `Ingredient with ID ${ingredient.ingredientId} does not exist`
          )
        );
      }
      const measureFactor = ingredient.measure / 100;
      totalRecipeWeight += ingredient.measure;
      totalCalories += ingredientData.calories * measureFactor;
      totalCarbohydrate += ingredientData.carbohydrate * measureFactor;
      totalProtein += ingredientData.protein * measureFactor;
      totalFat += ingredientData.totalFat * measureFactor;
      totalSaturatedFat += ingredientData.saturatedFat * measureFactor;
      totalFiber += ingredientData.fiber * measureFactor;
      totalSodium += ingredientData.sodium * measureFactor;
    }

    // Atualizar os campos calculados
    if (update.$set) {
      update.$set.recipeWeight = totalRecipeWeight;
      update.$set.calories = totalCalories;
      update.$set.carbohydrate = totalCarbohydrate;
      update.$set.protein = totalProtein;
      update.$set.totalFat = totalFat;
      update.$set.saturatedFat = totalSaturatedFat;
      update.$set.fiber = totalFiber;
      update.$set.sodium = totalSodium;
    } else {
      update.recipeWeight = totalRecipeWeight;
      update.calories = totalCalories;
      update.carbohydrate = totalCarbohydrate;
      update.protein = totalProtein;
      update.totalFat = totalFat;
      update.saturatedFat = totalSaturatedFat;
      update.fiber = totalFiber;
      update.sodium = totalSodium;
    }
  }

  next();
});

// Instance method to return computed nutrition values
recipeSchema.methods.calculateNutrition = function () {
  // Use stored computed fields when available
  const weight = this.recipeWeight || 0;

  const nutrition = {
    recipeWeight: weight,
    calories: this.calories || 0,
    carbohydrate: this.carbohydrate || 0,
    protein: this.protein || 0,
    totalFat: this.totalFat || 0,
    saturatedFat: this.saturatedFat || 0,
    fiber: this.fiber || 0,
    sodium: this.sodium || 0,
  };

  // Also provide per-100g values when recipeWeight is available
  if (weight > 0) {
    const factor = 100 / weight;
    nutrition.per100g = {
      calories: Math.round(nutrition.calories * factor * 100) / 100,
      carbohydrate: Math.round(nutrition.carbohydrate * factor * 100) / 100,
      protein: Math.round(nutrition.protein * factor * 100) / 100,
      totalFat: Math.round(nutrition.totalFat * factor * 100) / 100,
      saturatedFat: Math.round(nutrition.saturatedFat * factor * 100) / 100,
      fiber: Math.round(nutrition.fiber * factor * 100) / 100,
      sodium: Math.round(nutrition.sodium * factor * 100) / 100,
    };
  }

  return nutrition;
};

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
