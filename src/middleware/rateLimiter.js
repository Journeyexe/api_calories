import rateLimit from "express-rate-limit";

// Detecta ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isProduction ? 10 : 100, // 10 requisições em produção, 100 em dev
  message: "Muitas tentativas de login, tente novamente em 15 minutos",
  standardHeaders: true,
  legacyHeaders: false,
  // Permite pular o rate limit em desenvolvimento
  skip: (req) => !isProduction && process.env.SKIP_RATE_LIMIT === "true",
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000, // 100 em produção, 1000 em dev
  message: "Muitas requisições, tente novamente mais tarde",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction && process.env.SKIP_RATE_LIMIT === "true",
});
