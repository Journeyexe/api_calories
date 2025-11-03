import { Schema } from "mongoose";
import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";
import sanitize from "mongoose-sanitize";

const ingredientSchema = new Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Add timestamps plugin
ingredientSchema.plugin(timestamps);

// Add sanitize plugin
ingredientSchema.plugin(sanitize);

// Índices para melhorar performance de queries
ingredientSchema.index({ name: 1 });
ingredientSchema.index({ user: 1, name: 1 });
ingredientSchema.index({ calories: 1 });

// Pre-save hook to normalize name
ingredientSchema.pre("save", function (next) {
  this.name = this.name.trim().toLowerCase();
  next();
});

// Static method to find food by calories range
ingredientSchema.statics.findByCaloriesRange = function (min, max) {
  return this.find({ calories: { $gte: min, $lte: max } });
};

// Instance method to get nutrition summary
ingredientSchema.methods.getNutritionSummary = function () {
  return `Name: ${this.name}, Calories: ${this.calories}, Protein: ${this.protein}g, Carbs: ${this.carbohydrate}g, Total Fat: ${this.totalFat}g, Saturated Fat: ${this.saturatedFat}g, Fiber: ${this.fiber}g, Sodium: ${this.sodium}mg`;
};

// Virtual for calories from fat
ingredientSchema.virtual("caloriesFromFat").get(function () {
  return this.totalFat * 9; // 9 calories per gram of fat
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
