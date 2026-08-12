import express from 'express';
import { getCampaigns, getCampaignById } from '../controllers/campaignController.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);

export default router;
