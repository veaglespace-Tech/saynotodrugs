import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getOtp() {
  const user = await prisma.adminUser.findUnique({ where: { email: 'abhijeetambhore4@gmail.com' } });
  console.log('OTP:', user?.otp);
  await prisma.$disconnect();
}
getOtp();
