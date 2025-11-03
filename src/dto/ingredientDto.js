export class IngredientDto {
  constructor(ingredient) {
    this.id = ingredient._id;
    this.name = ingredient.name;
    this.calories = ingredient.calories;
    this.protein = ingredient.protein;
    this.carbs = ingredient.carbs;
    this.fat = ingredient.fat;
    this.fiber = ingredient.fiber;
    this.sodium = ingredient.sodium;
    this.user = ingredient.user;
    this.createdAt = ingredient.createdAt;
    this.updatedAt = ingredient.updatedAt;
  }
}
