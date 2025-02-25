# 🍏 Calories API

Uma API RESTful para gerenciamento de alimentos, ingredientes e receitas com cálculo automático de informações nutricionais. 🥗🍳

## 🌟 Visão Geral

Esta API permite gerenciar um banco de dados de alimentos e receitas, incluindo:
- 📝 Cadastro de alimentos com informações nutricionais
- 🥄 Cadastro de ingredientes com valores nutricionais por 100g
- 📊 Criação de receitas com cálculo automático de nutrientes baseado nos ingredientes
- 🔍 Consultas por faixa de calorias
- 🧼 Sanitização de dados e validação completa

## 🛠️ Tecnologias Utilizadas

- Node.js 🟢
- Express 🚀
- MongoDB 🍃
- Mongoose 🦡
- Winston (logging) 📜
- Cors 🌐
- Dotenv 🔧

## 📂 Estrutura do Projeto

```
api_calories/
├── src/
│   ├── config/
│   │   ├── database.js 🗄️
│   │   └── logger.js 📝
│   ├── controllers/
│   │   ├── IngredientController.js 🍎
│   │   └── recipeController.js 🍲
│   ├── middleware/
│   │   └── errorHandler.js 🚨
│   ├── models/
│   │   ├── Ingredient_model.js 🍏
│   │   ├── ingredientModel.js 🧂
│   │   └── recipeModel.js 📄
│   └── routes/
│       ├── IngredientRoutes.js 🛤️
│       └── recipeRoutes.js 🛤️
├── app.js 🖥️
├── .env 🔒
└── package.json 📦
```

## 🚀 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd api_calories
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/calories_db
CORS_ORIGIN=*
```

4. Inicie o servidor
```bash
npm start
```

## 📊 Modelos de Dados

### 🍎 Ingredient
- `name` (String): Nome do alimento (único)
- `calories` (Number): Calorias por porção
- `protein` (Number): Quantidade de proteína em gramas
- `carbohydrate` (Number): Quantidade de carboidratos em gramas
- `fat` (Number): Quantidade de gordura em gramas
- `totalFat` (Number): Gordura total
- `saturatedFat` (Number): Gordura saturada
- `fiber` (Number): Fibras
- `sodium` (Number): Sódio

### 📄 Recipe
- `name` (String): Nome da receita (único)
- `description` (String): Descrição da receita
- `recipeWeight` (Number): Peso total da receita (calculado automaticamente)
- `ingredients` (Array): Lista de ingredientes com suas medidas
- Informações nutricionais (calculadas automaticamente):
  - `calories`
  - `carbohydrate`
  - `protein`
  - `totalFat`
  - `saturatedFat`
  - `fiber`
  - `sodium`

## 🌐 Endpoints da API

### 🍎 Alimentos (Ingredients)

- **GET /api/ingredients**
  - Retorna todos os alimentos cadastrados

- **POST /api/ingredients**
  - Cria um novo alimento
  - Corpo da requisição:
    ```json
    {
      "name": "Arroz Integral",
      "calories": 130,
      "protein": 2.7,
      "carbohydrate": 28,
      "totalFat": 0.3,
      "saturatedFat": 0,
      "fiber": 0.4,
      "sodium": 10
    }
    ```

- **GET /api/ingredients/calories-range?min=100&max=300**
  - Retorna alimentos em uma faixa específica de calorias

### 📄 Receitas (Recipes)

- **GET /api/recipes**
  - Retorna todas as receitas com detalhes dos ingredientes

- **GET /api/recipes/:id**
  - Retorna uma receita específica por ID

- **POST /api/recipes**
  - Cria uma nova receita
  - Corpo da requisição:
    ```json
    {
      "name": "Salada de Quinoa",
      "description": "Uma salada nutritiva e refrescante",
      "ingredients": [
        {
          "ingredientId": "60a1b2c3d4e5f6a7b8c9d0e1",
          "measure": 100
        },
        {
          "ingredientId": "60a1b2c3d4e5f6a7b8c9d0e2",
          "measure": 50
        }
      ]
    }
    ```
  - Os valores nutricionais serão calculados automaticamente

- **PUT /api/recipes/:id**
  - Atualiza uma receita existente

- **DELETE /api/recipes/:id**
  - Remove uma receita do banco de dados

## ✨ Características Especiais

1. **Cálculo Automático de Nutrientes**:
   - As receitas calculam automaticamente os valores nutricionais com base nos ingredientes

2. **Validação e Sanitização**:
   - Todos os dados são validados e sanitizados antes de serem armazenados

3. **Tratamento de Erros Centralizado**:
   - Middleware de erro para respostas padronizadas

4. **Logging Avançado**:
   - Sistema de logging com Winston para monitoramento e debug


## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
