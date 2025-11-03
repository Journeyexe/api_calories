export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Recurso") {
    super(`${resource} não encontrado`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 400);
  }
}
