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
