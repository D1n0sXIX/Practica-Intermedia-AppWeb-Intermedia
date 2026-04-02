import { Router } from 'express';
import { register , verifyEmail, login, updatePersonalData} from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, verificationSchema , loginSchema, personalDataSchema} from '../validators/user.validator.js'
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoints
router.post('/register', validate(registerSchema), register);

router.put('/validation', authMiddleware, validate(verificationSchema), verifyEmail);

router.post('/login', validate(loginSchema), login);

router.put('/register', authMiddleware, validate(personalDataSchema), updatePersonalData);

router.patch('/company', (req, res) => {
    res.json({ message: 'Empresa actualizada' });
});
router.patch('/logo', (req, res) => {
    res.json({ message: 'Logo actualizado' });
});

router.get('/', (req, res) => {
    res.json({ message: 'Información del usuario' });
});

router.post('/refresh', (req, res) => {
    res.json({ message: 'Token renovado' });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Usuario desconectado' });
});

router.delete('/', (req, res) => {
    res.json({ message: 'Usuario eliminado' });
});

router.put('/password', (req, res) => {
    res.json({ message: 'Contraseña actualizada' });
});

router.post('/invite', (req, res) => {
    res.json({ message: 'Invitación enviada' });
});


export default router;



