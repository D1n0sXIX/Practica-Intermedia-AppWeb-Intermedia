import { AppError } from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return next(AppError.validation('Error de validación', result.error.errors.map(err => err.message)));
    }
    next();
};
