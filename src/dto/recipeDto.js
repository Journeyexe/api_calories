export class RecipeDto {
  constructor(recipe) {
    this.id = recipe._id;
    this.name = recipe.name;
    this.description = recipe.description;
    this.ingredients = recipe.ingredients;
    this.user = recipe.user;
    this.createdAt = recipe.createdAt;
    this.updatedAt = recipe.updatedAt;
  }
}
