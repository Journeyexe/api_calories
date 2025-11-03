import redisClient, { getRedisStatus } from "../config/redis.js";

export const cache = (duration = 300) => {
  return async (req, res, next) => {
    // Skip caching if not a GET request or Redis is not available
    if (req.method !== "GET" || !redisClient || !getRedisStatus()) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(key);

      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        redisClient.setEx(key, duration, JSON.stringify(data)).catch(() => {
          // Silently ignore cache errors
        });
        originalJson(data);
      };

      next();
    } catch (error) {
      // Se Redis falhar, continua sem cache
      next();
    }
  };
};
