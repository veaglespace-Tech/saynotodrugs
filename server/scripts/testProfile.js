import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

const prisma = new PrismaClient();

async function testProfileRoute() {
  try {
    const admin = await prisma.adminUser.findFirst();
    const token = jwt.sign({ id: admin.id, role: admin.role }, config.jwtKey, { expiresIn: '1h' });
    
    const response = await fetch('http://localhost:5000/api/admin/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log('Profile Response:', response.status, data);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
testProfileRoute();
