# 🍏 Calories API - Com Autenticação JWT

Uma API RESTful para gerenciamento de alimentos, ingredientes e receitas com cálculo automático de informações nutricionais e sistema de autenticação seguro. 🥗🍳🔒

## 🌟 Novas Funcionalidades

- 🔐 Sistema de autenticação com JWT
- 👤 Cadastro e gerenciamento de usuários
- 🛡️ Proteção de endpoints com middleware de autenticação
- 👩‍🍳 Associação de receitas/ingredientes ao usuário que os criou
- 🚦 Controle de acesso baseado em roles (usuário/admin)

## 🛠️ Tecnologias Utilizadas (Atualizado)

- Node.js 🟢
- Express 🚀
- MongoDB 🍃
- Mongoose 🦡
- JWT (Autenticação) 🔐
- Bcryptjs (Hash de senhas) 🛡️
- Winston (logging) 📜
- Cors 🌐
- Dotenv 🔧
- Cookie-parser 🍪

## 📂 Estrutura do Projeto (Atualizada)

```
api_calories/
├── src/
│   ├── config/
│   │   ├── database.js 🗄️
│   │   └── logger.js 📝
│   ├── controllers/
│   │   ├── authController.js 🔑
│   │   ├── ingredientController.js 🍎
│   │   └── recipeController.js 🍲
│   ├── middleware/
│   │   ├── authMiddleware.js 🛡️
│   │   └── errorHandler.js 🚨
│   ├── models/
│   │   ├── userModel.js 👤
│   │   ├── ingredientModel.js 🧂
│   │   └── recipeModel.js 📄
│   └── routes/
│       ├── authRoutes.js 🛤️
│       ├── ingredientRoutes.js 🛤️
│       └── recipeRoutes.js 🛤️
├── app.js 🖥️
├── .env 🔒
└── package.json 📦
```

## 🚀 Instalação (Atualizada)

1. Clone o repositório
```bash
git clone https://github.com/Journeyexe/api_calories
cd api_calories
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/calories_db
CORS_ORIGIN=*
JWT_SECRET=seu_segredo_super_secreto_aqui
JWT_EXPIRES_IN=30d
```

4. Inicie o servidor
```bash
npm start
```

## 🔐 Fluxo de Autenticação

1. **Registro de Usuário**:
   ```bash
   POST /api/auth/register
   ```
   ```json
   {
     "name": "Nome do Usuário",
     "email": "usuario@exemplo.com",
     "password": "senha123"
   }
   ```

2. **Login**:
   ```bash
   POST /api/auth/login
   ```
   ```json
   {
     "email": "usuario@exemplo.com",
     "password": "senha123"
   }
   ```

3. **Acesso Protegido**:
   - Inclua o token JWT no header `Authorization: Bearer <token>`
   - Ou use o cookie `jwt` automaticamente enviado após login

## 📊 Modelos de Dados (Atualizados)

### 👤 User
- `name` (String): Nome do usuário
- `email` (String): E-mail (único)
- `password` (String): Senha (hash)
- `role` (String): Tipo de usuário (user/admin)

### 🍎 Ingredient (Atualizado)
- Todos os campos anteriores +
- `user` (ObjectId): Referência ao usuário criador

### 📄 Recipe (Atualizado)
- Todos os campos anteriores +
- `user` (ObjectId): Referência ao usuário criador

## 🌐 Endpoints da API (Atualizados)

### 🔑 Autenticação (Auth)

- **POST /api/auth/register** - Registra novo usuário
- **POST /api/auth/login** - Realiza login
- **POST /api/auth/logout** - Realiza logout
- **GET /api/auth/me** - Retorna dados do usuário logado

### 🍎 Alimentos (Ingredients) [Protegidos]

- Todos os endpoints anteriores agora requerem autenticação
- Cada usuário só acessa seus próprios ingredientes

### 📄 Receitas (Recipes) [Protegidos]

- Todos os endpoints anteriores agora requerem autenticação
- Cada usuário só acessa suas próprias receitas

## ✨ Características Especiais (Atualizadas)

1. **Autenticação Segura**:
   - Tokens JWT com expiração
   - Senhas armazenadas como hash
   - Proteção contra ataques CSRF

2. **Controle de Acesso**:
   - Middleware de autenticação em todas as rotas
   - Cada usuário tem acesso apenas aos seus próprios recursos

3. **Sistema de Logout**:
   - Invalidação de tokens via cookies

4. **Novos Recursos**:
   - Endpoint para obter dados do usuário logado
   - Validação de e-mail único
   - Tratamento de erros específicos para autenticação

## 🤝 Contribuição (Atualizado)

1. Faça um fork do projeto
2. Crie uma feature branch (`git checkout -b feature/nova-feature`)
3. Certifique-se de testar as mudanças com autenticação
4. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
5. Push para a branch (`git push origin feature/nova-feature`)
6. Abra um Pull Request

## 📌 Notas Importantes

- Todos os endpoints (exceto /auth) requerem autenticação
- O token JWT deve ser enviado no header `Authorization` como `Bearer <token>`
- Em produção, configure HTTPS e opções seguras para cookies
