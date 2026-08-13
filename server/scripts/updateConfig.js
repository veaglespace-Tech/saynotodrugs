import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const english = "I pledge to say NO to drugs and substance abuse. I commit to making healthy choices, spreading awareness in my community, and supporting those in need to build a stronger, safer, and drug-free society. Together, we can make a difference.";
  const hindi = "मैं नशीली दवाओं और मादक पदार्थों के सेवन को ना कहने की प्रतिज्ञा करता हूँ। मैं स्वस्थ विकल्प चुनने, अपने समुदाय में जागरूकता फैलाने और एक मजबूत, सुरक्षित और नशामुक्त समाज के निर्माण के लिए जरूरतमंद लोगों का समर्थन करने के लिए प्रतिबद्ध हूँ। साथ मिलकर, हम एक बदलाव ला सकते हैं।";
  const marathi = "मी अमली पदार्थ आणि व्यसनांना नाही म्हणण्याची प्रतिज्ञा करतो. मी निरोगी पर्याय निवडण्यास, माझ्या समाजात जागरूकता पसरवण्यास आणि एक मजबूत, सुरक्षित आणि व्यसनमुक्त समाज घडवण्यासाठी गरजूंना पाठिंबा देण्यास वचनबद्ध आहे. आपण एकत्र येऊन नक्कीच बदल घडवू शकतो.";
  
  await prisma.siteConfig.update({
    where: { id: 1 },
    data: {
      pledgeEnglish: english,
      pledgeHindi: hindi,
      pledgeMarathi: marathi
    }
  });
  
  console.log("Config updated successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
