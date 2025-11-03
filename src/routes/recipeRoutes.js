import express from "express";
import { recipeController } from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createRecipeValidator,
  updateRecipeValidator,
} from "../validators/recipeValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { checkOwnership } from "../middleware/checkOwnership.js";
import Recipe from "../models/recipeModel.js";
import { cache } from "../middleware/cache.js";

export const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Listar todas as receitas
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de receitas
 *   post:
 *     summary: Criar nova receita
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Receita criada
 */
router
  .route("/")
  .get(cache(300), recipeController.getAllRecipes)
  .post(createRecipeValidator, validate, recipeController.createRecipe);

router.route("/me").get(recipeController.getMyRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Buscar receita por ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receita encontrada
 *   put:
 *     summary: Atualizar receita
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Receita atualizada
 *   delete:
 *     summary: Deletar receita
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Receita deletada
 */
router
  .route("/:id")
  .get(validateObjectId(), cache(300), recipeController.getRecipeById)
  .put(
    validateObjectId(),
    checkOwnership(Recipe),
    updateRecipeValidator,
    validate,
    recipeController.updateRecipe
  )
  .delete(
    validateObjectId(),
    checkOwnership(Recipe),
    recipeController.deleteRecipe
  );
