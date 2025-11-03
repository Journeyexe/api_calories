import { body } from "express-validator";

export const createIngredientValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("calories")
    .isFloat({ min: 0 })
    .withMessage("Calorias deve ser um número positivo"),
  body("protein")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Proteína deve ser um número positivo"),
  body("carbs")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Carboidratos deve ser um número positivo"),
  body("fat")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Gordura deve ser um número positivo"),
];

export const updateIngredientValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("calories")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Calorias deve ser um número positivo"),
  body("protein")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Proteína deve ser um número positivo"),
  body("carbs")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Carboidratos deve ser um número positivo"),
  body("fat")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Gordura deve ser um número positivo"),
];
