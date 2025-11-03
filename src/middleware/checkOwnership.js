export const checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: "Recurso não encontrado",
        });
      }

      // Admins podem fazer tudo
      if (req.user.role === "admin") {
        return next();
      }

      // Verifica se o usuário é o dono
      if (resource.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Não autorizado a modificar este recurso",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
