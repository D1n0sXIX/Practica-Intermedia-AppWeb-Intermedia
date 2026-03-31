import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
    // muestra el error
    console.error(err);
    // Si es un error conocido (AppError), responde con su info
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.code,
            ...(err.details && { details: err.details })
        });
    }
    // Si es un error desconocido, responde con un mensaje geenrico y ya
    console.error('Error no manejado:', err);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
};