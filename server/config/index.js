import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtKey: process.env.JWT_KEY,
  clientUrl: process.env.CLIENT_URL,
  serverBaseUrl: process.env.SERVER_BASE_URL,
  payu: {
    baseUrl: process.env.PAYU_BASE_URL,
    testKey: process.env.PAYU_TEST_KEY,
    testSalt: process.env.PAYU_TEST_SALT
  },
  email: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
};
