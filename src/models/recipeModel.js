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
    unique: true,
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

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
