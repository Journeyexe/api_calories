import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Erro interno do servidor",
  });
};
