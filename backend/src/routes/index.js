import express from 'express';
import qrRoutes from './qrRoutes.js';

const router = express.Router();

// Mount all route modules
router.use('/qr', qrRoutes);

// You can add more route groups here in the future
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;