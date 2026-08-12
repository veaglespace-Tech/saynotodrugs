import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prisma.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Public (Should be private in production)
export const getStats = asyncHandler(async (req, res) => {
  const totalPledges = await prisma.pledge.count();
  
  const totalDonations = await prisma.donation.aggregate({
    where: { paymentStatus: 'success' },
    _sum: { amount: true }
  });
  
  const donorsCount = await prisma.donation.count({
    where: { paymentStatus: 'success' }
  });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPledges = await prisma.pledge.count({
    where: { pledgeDate: { gte: today } }
  });

  const todayDonations = await prisma.donation.aggregate({
    where: { paymentStatus: 'success', paymentDate: { gte: today } },
    _sum: { amount: true }
  });

  res.json({
    success: true,
    stats: {
      totalPledges,
      totalDonations: totalDonations._sum.amount || 0,
      donorsCount,
      certificatesGenerated: totalPledges,
      todayPledges,
      todayDonations: todayDonations._sum.amount || 0
    }
  });
});

// @desc    Get all pledges (for table/export)
// @route   GET /api/admin/pledges
// @access  Public
export const getPledges = asyncHandler(async (req, res) => {
  const pledges = await prisma.pledge.findMany({
    include: {
      user: true,
      certificates: true,
      donations: true,
      campaign: true
    },
    orderBy: { pledgeDate: 'desc' }
  });

  res.json({ success: true, pledges });
});
