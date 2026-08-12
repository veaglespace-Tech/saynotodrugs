import express from 'express';
import authRoutes from './auth.js';
import campaignRoutes from './campaign.js';
import pledgeRoutes from './pledge.js';
import adminRoutes from './admin.js';
import { getConfig } from '../controllers/configController.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/pledges', pledgeRoutes);
router.use('/admin', adminRoutes);

router.get('/config', getConfig);

export default router;
