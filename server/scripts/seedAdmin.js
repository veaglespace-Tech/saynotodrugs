import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const name = 'Admin';
  const email = 'abhijeetambhore4@gmail.com';
  const password = 'Veagle@123';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      name,
      role: 'super_admin'
    },
    create: {
      email,
      name,
      passwordHash: hashedPassword,
      role: 'super_admin'
    }
  });

  console.log(`Admin user seeded successfully: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
