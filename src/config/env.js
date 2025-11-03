import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  db: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  log: {
    level: process.env.LOG_LEVEL || "info",
  },
};
