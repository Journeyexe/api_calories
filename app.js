import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import { router as ingredientRoutes } from "./src/routes/ingredientRoutes.js";
import { router as recipeRoutes } from "./src/routes/recipeRoutes.js";
import { router as authRoutes } from "./src/routes/authRoutes.js";
import { router as healthRoutes } from "./src/routes/healthRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { logger } from "./src/config/logger.js";
import { generalLimiter } from "./src/middleware/rateLimiter.js";
import { setupSwagger } from "./src/config/swagger.js";
import { config } from "./src/config/env.js";

const app = express();
const port = config.port;

// Criar stream para winston
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Segurança - Helmet
app.use(helmet());

// Development logging
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Production logging
if (config.env === "production") {
  app.use(morgan("combined", { stream }));
}

// Body parser
app.use(express.json());
app.use(cookieParser());

// Sanitização de dados
app.use(mongoSanitize());
app.use(xss());

// Compressão de respostas
app.use(compression());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiting
app.use("/api/", generalLimiter);

// Swagger Documentation
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use(healthRoutes);

// Error handling
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    await connectDB(config.db.uri);

    // Conectar Redis (opcional, não falha se não estiver disponível)
    try {
      await connectRedis();
    } catch (error) {
      logger.warn("Continuando sem Redis cache");
    }

    app.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`);
      logger.info(
        `Documentação disponível em http://localhost:${port}/api-docs`
      );
    });
  } catch (error) {
    logger.error(`Erro ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
