import { body } from "express-validator";

export const createRecipeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Descrição deve ter no máximo 500 caracteres"),
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Deve conter pelo menos um ingrediente"),
  body("ingredients.*.ingredientId")
    .notEmpty()
    .withMessage("ID do ingrediente é obrigatório"),
  body("ingredients.*.quantity")
    .isFloat({ min: 0.1 })
    .withMessage("Quantidade deve ser maior que 0"),
];

export const updateRecipeValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Descrição deve ter no máximo 500 caracteres"),
  body("ingredients")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Deve conter pelo menos um ingrediente"),
  body("ingredients.*.ingredientId")
    .optional()
    .notEmpty()
    .withMessage("ID do ingrediente é obrigatório"),
  body("ingredients.*.quantity")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Quantidade deve ser maior que 0"),
];
