import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma.js';

// @desc    Get all active campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'active' },
  });

  const totalPledges = await prisma.pledge.count();
  
  const totalDonations = await prisma.donation.aggregate({
    where: { paymentStatus: 'success' },
    _sum: { amount: true }
  });

  const donorsCount = await prisma.donation.count({
    where: { paymentStatus: 'success' }
  });

  res.json({ 
    success: true, 
    campaigns,
    stats: {
      totalPledges,
      totalDonations: totalDonations._sum.amount || 0,
      donorsCount
    }
  });
});

// @desc    Get a single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  res.json({ success: true, campaign });
});
