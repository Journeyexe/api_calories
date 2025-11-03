import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nome deve ter entre 2 e 50 caracteres"),
  body("email").trim().normalizeEmail().isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Senha deve conter: maiúscula, minúscula, número e caractere especial"
    ),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
];
