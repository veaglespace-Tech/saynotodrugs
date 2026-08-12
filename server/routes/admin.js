import express from 'express';
import { getStats, getPledges } from '../controllers/adminController.js';
import { updateConfig } from '../controllers/configController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/pledges', getPledges);
router.put('/config', updateConfig);

export default router;
