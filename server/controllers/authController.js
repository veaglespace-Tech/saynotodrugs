import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
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
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
