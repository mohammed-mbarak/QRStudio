import express from 'express';
import {
  generateQR,
  getQRCode,
  getQRCodes,
  healthCheck
} from '../controllers/qrController.js';
import { validateQRGeneration } from '../middlewares/validation.js'; 

const router = express.Router();

router.get('/health', healthCheck);
router.post('/generate', validateQRGeneration, generateQR); 
router.get('/', getQRCodes);
router.get('/:id', getQRCode);

export default router;