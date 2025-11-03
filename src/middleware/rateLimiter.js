import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo de 5 requisições
  message: "Muitas tentativas de login, tente novamente em 15 minutos",
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições, tente novamente mais tarde",
  standardHeaders: true,
  legacyHeaders: false,
});
