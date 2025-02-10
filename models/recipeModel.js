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
  calories: {
    type: Number,
    required: [true, "Calories are required"],
    min: [0, "Calories must be at least 0"],
  },
  carbohydrate: {
    type: Number,
    required: [true, "Carbohydrate is required"],
    min: [0, "Carbohydrate must be at least 0"],
  },
  protein: {
    type: Number,
    required: [true, "Protein is required"],
    min: [0, "Protein must be at least 0"],
  },
  totalFat: {
    type: Number,
    required: [true, "Total Fat is required"],
    min: [0, "Total Fat must be at least 0"],
  },
  saturatedFat: {
    type: Number,
    required: [true, "Saturated Fat is required"],
    min: [0, "Saturated Fat must be at least 0"],
  },
  fiber: {
    type: Number,
    required: [true, "Fiber is required"],
    min: [0, "Fiber must be at least 0"],
  },
  sodium: {
    type: Number,
    required: [true, "Sodium is required"],
    min: [0, "Sodium must be at least 0"],
  },
  description: {
    type: String,
    trim: true,
  },
  ingredients: [recipeIngredientSchema],
});

// Add timestamps plugin
recipeSchema.plugin(timestamps);

// Add sanitize plugin
recipeSchema.plugin(sanitize);

// Pre-save hook to normalize name
recipeSchema.pre("save", async function (next) {
  this.name = this.name.trim().toLowerCase();

  // Verificação de ingredientId
  for (const ingredient of this.ingredients) {
    const ingredientExists = await Ingredient.findById(ingredient.ingredientId);
    if (!ingredientExists) {
      return next(new Error(`Ingredient with ID ${ingredient.ingredientId} does not exist`));
    }
  }

  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;