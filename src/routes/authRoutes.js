import express from "express";
import { authController } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  authController.login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout de usuário
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get("/me", protect, authController.getMe);
