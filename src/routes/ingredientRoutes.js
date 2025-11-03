import express from "express";
import { ingredientController } from "../controllers/ingredientController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createIngredientValidator,
  updateIngredientValidator,
} from "../validators/ingredientValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { checkOwnership } from "../middleware/checkOwnership.js";
import Ingredient from "../models/ingredientModel.js";
import { cache } from "../middleware/cache.js";

export const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Listar todos os ingredientes
 *     tags: [Ingredients]
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo para ordenação
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Campos a retornar (separados por vírgula)
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 *   post:
 *     summary: Criar novo ingrediente
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       201:
 *         description: Ingrediente criado
 */
router
  .route("/")
  .get(cache(300), ingredientController.getAllIngredients)
  .post(
    createIngredientValidator,
    validate,
    ingredientController.createIngredient
  );

router.route("/me").get(ingredientController.getMyIngredients);

router.get(
  "/calories-range",
  ingredientController.getIngredientByCaloriesRange
);

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Buscar ingrediente por ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingrediente encontrado
 *       404:
 *         description: Ingrediente não encontrado
 *   put:
 *     summary: Atualizar ingrediente
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       200:
 *         description: Ingrediente atualizado
 *   delete:
 *     summary: Deletar ingrediente
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingrediente deletado
 */
router
  .route("/:id")
  .get(validateObjectId(), cache(300), ingredientController.getIngredientById)
  .put(
    validateObjectId(),
    checkOwnership(Ingredient),
    updateIngredientValidator,
    validate,
    ingredientController.updateIngredient
  )
  .delete(
    validateObjectId(),
    checkOwnership(Ingredient),
    ingredientController.deleteIngredient
  );
