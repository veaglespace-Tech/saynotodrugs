import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Cleaning user data and resetting IDs...");
    
    // Disable foreign key checks to allow TRUNCATE
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    
    // TRUNCATE removes all rows AND resets AUTO_INCREMENT to 1
    await prisma.$executeRawUnsafe('TRUNCATE TABLE donations;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE certificates;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE pledges;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE users;');
    
    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log("Success! Dummy data removed and IDs will start from 1.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
