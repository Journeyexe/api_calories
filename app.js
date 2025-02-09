import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/database.js";
import { router as foodRoutes } from "./routes/foodRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./config/logger.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/foods", foodRoutes);

// Error handling
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    logger.error(`Erro ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();