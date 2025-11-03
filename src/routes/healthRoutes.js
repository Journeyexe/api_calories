import express from "express";
import mongoose from "mongoose";

export const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status de saúde da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação está saudável
 *       503:
 *         description: Aplicação não está saudável
 */
router.get("/health", async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    checks: {
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      memory: process.memoryUsage(),
    },
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error.message;
    res.status(503).json(healthCheck);
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Verifica se a aplicação está pronta para receber requisições
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação está pronta
 *       503:
 *         description: Aplicação não está pronta
 */
router.get("/health/ready", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: "ready" });
  } else {
    res.status(503).json({ status: "not ready" });
  }
});
