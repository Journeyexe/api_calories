import { createClient } from "redis";
import { logger } from "./logger.js";

let redisClient = null;
let isRedisAvailable = false;

// Only create Redis client if REDIS_ENABLED is true
if (process.env.REDIS_ENABLED === "true") {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redisClient.on("error", (err) => {
    logger.warn("Redis Error:", err.message);
    isRedisAvailable = false;
  });

  redisClient.on("connect", () => {
    logger.info("Redis conectado");
    isRedisAvailable = true;
  });

  redisClient.on("ready", () => {
    isRedisAvailable = true;
  });
}

export const connectRedis = async () => {
  if (!redisClient) {
    logger.info("Redis desabilitado - continuando sem cache");
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    logger.warn("Redis não está disponível, continuando sem cache");
    isRedisAvailable = false;
  }
};

export const getRedisStatus = () => isRedisAvailable;

export default redisClient;
