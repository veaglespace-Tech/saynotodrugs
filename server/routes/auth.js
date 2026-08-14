import express from 'express';
import { authUser, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/verify-otp', verifyOtp);

export default router;
