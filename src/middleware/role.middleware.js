import { AppError } from "../utils/AppError.js";

export const requieredRole = (...roles) => (req, res, next) => {
    // Primera verificación: el usuario debe estar autenticado
    if (!req.user) {
        return next(AppError.unauthorized('Usuario no autenticado'));
    }
    // Segunda verificación: el usuario debe tener uno de los roles requeridos
    if (!roles.includes(req.user.role)) {
        return next(AppError.forbidden('Acceso denegado: rol insuficiente'));
    }
    next();
};