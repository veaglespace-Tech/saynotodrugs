import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import ReduxProvider from '../components/ReduxProvider';

export const metadata = {
  title: 'Say No to Drugs | Independence Day 2026 — Drug-Free India Pledge',
  description: 'Take a stand against substance abuse this Independence Day. Join the national movement, pledge to stay drug-free, and receive your official certificate. Together, we build a stronger, healthier India.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
