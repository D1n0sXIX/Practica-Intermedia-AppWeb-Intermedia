import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/index.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './middleware/error-handler.js'

const app = express();
// Añadimos middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
});
app.use(limiter);

app.use('/api/user', userRouter);
app.use(errorHandler);

export default app;