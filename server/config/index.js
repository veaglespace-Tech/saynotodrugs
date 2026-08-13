import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtKey: process.env.JWT_KEY,
  clientUrl: process.env.CLIENT_URL,
  serverBaseUrl: process.env.SERVER_BASE_URL,
  payu: {
    baseUrl: process.env.NODE_ENV === 'production' ? (process.env.PAYU_BASE_URL || 'https://secure.payu.in/_payment') : 'https://test.payu.in/_payment',
    key: process.env.NODE_ENV === 'production' ? process.env.PAYU_MERCHANT_KEY : (process.env.PAYU_TEST_KEY || process.env.PAYU_MERCHANT_KEY),
    salt: process.env.NODE_ENV === 'production' ? process.env.PAYU_MERCHANT_SALT : (process.env.PAYU_TEST_SALT || process.env.PAYU_MERCHANT_SALT),
  },
  email: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
};
