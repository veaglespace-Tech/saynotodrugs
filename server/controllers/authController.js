import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { sendOtpEmail } from '../services/emailService.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt }
    });

    // Send email
    await sendOtpEmail(user.email, user.name, otp);

    res.json({
      success: true,
      requiresOtp: true,
      message: 'OTP sent to your email.'
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Verify OTP & get token
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (!user || user.otp !== otp) {
    res.status(401);
    throw new Error('Invalid OTP');
  }

  if (user.otpExpiresAt < new Date()) {
    res.status(401);
    throw new Error('OTP expired');
  }

  // Clear OTP
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { otp: null, otpExpiresAt: null }
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: jwt.sign({ id: user.id, role: user.role }, config.jwtKey, {
      expiresIn: '30d',
    })
  });
});
