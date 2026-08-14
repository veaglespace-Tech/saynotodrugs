import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPledgeHindi = [
  "मैं नशीले पदार्थो और नशे की लत को दृढ़ता से ना कहूँगा/कहूँगी और स्वस्थ, जिम्मेदार एवं सकारात्मक जीवन जीने का प्रयास करूँगा/करूँगी।",
  "मैं अपने शरीर, मन, रिश्तों और भविष्य को नुकसान पहुँचाने वाले अवैध ड्रग्स और मादक पदार्थो से दूर रहूँगा/रहूँगी।",
  "मैं तंबाकू और निकोटीन उत्पादों को ना कहूँगा/कहूँगी, जिनमें सिगरेट, बीड़ी, गुटखा, खैनी, पान मसाला, चबाने वाला तंबाकू, वेपिंग उत्पाद, ई-सिगरेट और अन्य तंबाकू या निकोटीन उत्पाद शामिल हैं।",
  "मैं शराब और हानिकारक पदार्थो के दुरुपयोग से दूर रहूँगा/रहूँगी और इनके दुरुपयोग को बढ़ावा नहीं दूँगा/दूँगी।",
  "मैं प्रिस्क्रिप्शन दवाओं और अन्य दवाओं का उपयोग केवल योग्य चिकित्सकीय विशेषज्ञ की सलाह के अनुसार और जिम्मेदारी से करूँगा/करूँगी।",
  "मैं ड्रग्स, तंबाकू, शराब या अन्य हानिकारक पदार्थों के दुरुपयोग को बढ़ावा नहीं दूँगा/दूँगी, न ही उनकी आपूर्ति, बिक्री या प्रचार करूँगा/करूँगी।",
  "मैं अपने परिवार, मित्रों और समाज के लोगों को स्वस्थ जीवनशैली अपनाने और नशे से दूर रहने के लिए प्रोत्साहित करूँगा/करूँगी।",
  "यदि मैं या मेरे किसी परिचित को नशे की लत या किसी पदार्थ पर निर्भरता से संघर्ष करना पड़ता है, तो मैं उन्हें उचित पेशेवर सहायता, उपचार और सहयोग लेने के लिए प्रोत्साहित करूँगा/करूँगी।",
  "मैं नशे और मादक पदार्थों के हानिकारक प्रभावों के बारे में जागरूकता फैलाने में योगदान दूँगा/दूँगी और एक स्वस्थ, सुरक्षित एवं नशामुक्त समाज बनाने में अपनी भूमिका निभाऊँगा/निभाऊँगी।"
];

const defaultPledgeMarathi = [
  "मी अमली पदार्थ आणि व्यसनाधीनतेला ठामपणे नकार देईन आणि निरोगी, जबाबदार व सकारात्मक जीवन जगण्याचा प्रयत्न करेन.",
  "माझ्या शरीराला, मनाला, नातेसंबंधांना आणि भविष्यातील जीवनाला हानी पोहोचवणाऱ्या बेकायदेशीर अमली पदार्थांपासून व मादक पदार्थांपासून मी दूर राहीन.",
  "मी तंबाखू व निकोटीनयुक्त पदार्थांना नकार देईन, ज्यामध्ये सिगारेट, बीडी, गुटखा, खैनी, पान मसाला, चघळण्याचा तंबाखू, व्हेपिंग उत्पादने, ई-सिगारेट आणि इतर तंबाखू किंवा निकोटीनयुक्त पदार्थांचा समावेश आहे.",
  "मी मद्यपान आणि हानिकारक पदार्थांच्या गैरवापरापासून दूर राहीन आणि त्यांच्या गैरवापरास प्रोत्साहन देणार नाही.",
  "मी प्रिस्क्रिप्शन औषधे आणि इतर औषधांचा वापर केवळ पात्र वैद्यकीय तज्ज्ञांच्या सल्ल्यानुसार आणि जबाबदारीने करेन.",
  "मी अमली पदार्थ, तंबाखू, मद्य किंवा इतर हानिकारक पदार्थांचा गैरवापर करण्यास प्रोत्साहन देणार नाही, त्यांचा पुरवठा, विक्री किंवा प्रसार करणार नाही.",
  "माझे कुटुंब, मित्र आणि समाजातील इतर व्यक्तींना निरोगी जीवनशैली स्वीकारण्यासाठी आणि व्यसनापासून दूर राहण्यासाठी मी प्रोत्साहित करेन.",
  "मला किंवा माझ्या ओळखीतील कोणाला व्यसनाधीनतेशी किंवा पदार्थांच्या अवलंबनतेशी संघर्ष करावा लागत असल्यास, त्यांना योग्य व्यावसायिक मदत, उपचार आणि आधार घेण्यासाठी प्रोत्साहित करेन.",
  "व्यसनाधीनतेच्या आणि अमली पदार्थांच्या दुष्परिणामांबद्दल जनजागृती करण्यासाठी मी योगदान देईन आणि निरोगी, सुरक्षित व व्यसनमुक्त समाज घडविण्यासाठी माझी भूमिका बजावेन."
];

const defaultPledgeEnglish = [
  "I will say NO to drugs and substance abuse and choose a healthy, responsible and positive life.",
  "I will stay away from illegal drugs and narcotic substances, including substances that can harm my body, mind, relationships and future.",
  "I will say NO to tobacco and nicotine products, including cigarettes, bidis, gutkha, khaini, pan masala, chewing tobacco, vaping products, e-cigarettes and other tobacco or nicotine products.",
  "I will avoid alcohol and harmful substance use and will not encourage or promote their misuse.",
  "I will use prescription medicines and other medicines only responsibly and as advised by a qualified medical professional.",
  "I will not encourage, supply, sell, share or promote the misuse of drugs, tobacco, alcohol or other harmful substances.",
  "I will encourage my family, friends and community to make healthy choices and stay away from substance abuse.",
  "If I or someone I know is struggling with substance dependence or addiction, I will encourage them to seek appropriate professional help, care and support.",
  "I will spread awareness about the harmful effects of substance abuse and contribute to building a healthy, safe and drug-free society."
];

async function seedConfig() {
  try {
    const configData = {
      donationUsage: "Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives.",
      pledgeEnglish: defaultPledgeEnglish.join('\n'),
      pledgeHindi: defaultPledgeHindi.join('\n'),
      pledgeMarathi: defaultPledgeMarathi.join('\n'),
      certificateFormat: "This certificate is proudly presented to {name} for taking the Say No to Drugs Pledge."
    };

    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: configData,
      create: {
        id: 1,
        ...configData
      }
    });

    console.log("Site config seeded successfully:", config.id);
  } catch (error) {
    console.error("Failed to seed config:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedConfig();
