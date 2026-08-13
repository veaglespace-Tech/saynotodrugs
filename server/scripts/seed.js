import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Campaign
  let campaign = await prisma.campaign.findFirst({
    where: { name: 'Say No to Drugs' }
  });

  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        name: 'Say No to Drugs',
        description: 'Take the Pledge. Spread Awareness. Build a Drug-Free Society.',
        donationEnabled: true,
        status: 'active'
      }
    });
    console.log('Campaign Say No to Drugs created.');
  } else {
    console.log('Campaign already exists.');
  }

  // 2. Seed Admin User
  const adminEmail = 'abhijeetambhore4@gmail.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Veagle@123', salt);

    await prisma.adminUser.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'super_admin'
      }
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }

  // 3. Seed SiteConfig
  const existingConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const english = "I pledge to say NO to drugs and substance abuse. I commit to making healthy choices, spreading awareness in my community, and supporting those in need to build a stronger, safer, and drug-free society. Together, we can make a difference.";
  const hindi = "मैं नशीली दवाओं और मादक पदार्थों के सेवन को ना कहने की प्रतिज्ञा करता हूँ। मैं स्वस्थ विकल्प चुनने, अपने समुदाय में जागरूकता फैलाने और एक मजबूत, सुरक्षित और नशामुक्त समाज के निर्माण के लिए जरूरतमंद लोगों का समर्थन करने के लिए प्रतिबद्ध हूँ। साथ मिलकर, हम एक बदलाव ला सकते हैं।";
  const marathi = "मी अमली पदार्थ आणि व्यसनांना नाही म्हणण्याची प्रतिज्ञा करतो. मी निरोगी पर्याय निवडण्यास, माझ्या समाजात जागरूकता पसरवण्यास आणि एक मजबूत, सुरक्षित आणि व्यसनमुक्त समाज घडवण्यासाठी गरजूंना पाठिंबा देण्यास वचनबद्ध आहे. आपण एकत्र येऊन नक्कीच बदल घडवू शकतो.";
  
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        id: 1,
        pledgeEnglish: english,
        pledgeHindi: hindi,
        pledgeMarathi: marathi,
        donationUsage: "Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives."
      }
    });
    console.log("SiteConfig created.");
  } else {
    await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        pledgeEnglish: english,
        pledgeHindi: hindi,
        pledgeMarathi: marathi
      }
    });
    console.log("SiteConfig updated.");
  }

  // No dummy users to seed as requested.
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
