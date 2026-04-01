import User from '../models/User.js';
import bcrypt  from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import notificationService from '../services/notification.service.js';

export const register = async (req, res, next) => {
    try {
        // extraemos email y password del body + validacion
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(AppError.conflict('Email ya registrado'));
        }

        // Encriptamos la contraseña + codigo de verificacion
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({ email, password: hashedPassword, verificationCode , verificationAttempts : 3});

        // Se guarda el usuario
        await user.save();
        notificationService.emit('user:registered', user);

        // Token de acceso y de refresh
        const accessToken = jsonwebtoken.sign({ userId: user._id, role: user.role }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiration });
        const refreshToken = jsonwebtoken.sign({ userId: user._id, role: user.role }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiration });

        // devolvemos datos del usuario + tokens
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                status: user.status,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }

};

export const verifyEmail = async (req, res, next) => {
    try {
        // Extraemos userId del token y el codigo del body
        const { userId } = req.user;
        const { code } = req.body;

        // Buscamos el usuario y comprobamos el codigo
        const user = await User.findById(userId);
        
        // Hacemos las comprobaciones
        // Si existe
        if (!user) {
            return next(AppError.notFound('Usuario no encontrado'));
        }
        // Si su numero de intentos es 0
        if (user.verificationAttempts <= 0) {
            return next(AppError.tooManyRequests());
        }
        // Si el codigo no coincide
        if (code !== user.verificationCode) {
            user.verificationAttempts -= 1;
            await user.save();
            return next(AppError.badRequest('Código incorrecto. Intentos restantes: ' + user.verificationAttempts));
        }
        
        if (code == user.verificationCode) {
            user.status = 'verified';
            await user.save();
            notificationService.emit('user:verified', user);
            return res.json({ message: 'Email verificado correctamente' });
        }
        
    } catch (error) {
        next(error);
    }
};

