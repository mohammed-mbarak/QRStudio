import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env as config } from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import rateLimiter from './middlewares/rateLimiter.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', rateLimiter);

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
