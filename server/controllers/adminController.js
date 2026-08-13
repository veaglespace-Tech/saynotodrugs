import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';

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

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  res.json({ success: true, admin });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin.id }
  });

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  const updateData = {};

  // Update name if provided
  if (name && name.trim()) {
    updateData.name = name.trim();
  }

  // Update email if provided
  if (email && email.trim()) {
    // Check if email is already taken by another admin
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: email.trim() }
    });
    if (existingAdmin && existingAdmin.id !== admin.id) {
      res.status(400);
      throw new Error('Email is already in use by another admin');
    }
    updateData.email = email.trim();
  }

  // Update password if provided
  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error('Current password is required to set a new password');
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    updateData.passwordHash = await bcrypt.hash(newPassword, salt);
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error('No fields to update');
  }

  const updatedAdmin = await prisma.adminUser.update({
    where: { id: req.admin.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  // Generate a new token with potentially updated info
  const token = jwt.sign({ id: updatedAdmin.id, role: updatedAdmin.role }, config.jwtKey, {
    expiresIn: '30d',
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    admin: updatedAdmin,
    token
  });
});

