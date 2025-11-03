import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Calories API",
      version: "1.0.0",
      description:
        "API para gerenciamento de alimentos e receitas com cálculo nutricional",
      contact: {
        name: "API Support",
        email: "support@caloriesapi.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
            },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            calories: {
              type: "number",
            },
            protein: {
              type: "number",
            },
            carbs: {
              type: "number",
            },
            fat: {
              type: "number",
            },
            fiber: {
              type: "number",
            },
            sodium: {
              type: "number",
            },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  ingredientId: {
                    type: "string",
                  },
                  quantity: {
                    type: "number",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
};
