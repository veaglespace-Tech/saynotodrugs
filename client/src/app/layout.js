import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import ReduxProvider from '../components/ReduxProvider';
import PublicLayout from '../components/PublicLayout';

export const metadata = {
  title: 'Say No to Drugs | Independence Day 2026 — Drug-Free India Pledge',
  description: 'This Independence Day, claim true freedom. Join the national movement against substance abuse, pledge to stay drug-free, and receive your official certificate. Together, we build a stronger, healthier India.',
  keywords: ['Say No To Drugs', 'Nasha Mukt Bharat', 'Vyasan Mukti', 'Vyasan Mukti Abhiyan', 'Nasha Mukti Maharashtra', 'Anti-Drug Pledge Certificate', 'Independence Day 2026 Pledge', 'Drug-Free India', 'Anti-Drug Campaign India', 'Veagle Space Technology', 'Drug Abuse Prevention', 'National Pledge against Drugs'],
  openGraph: {
    title: 'Say No to Drugs | Independence Day 2026 Pledge',
    description: 'Join the national movement to build a stronger, healthier India. Take the pledge to stay drug-free and receive your official Independence Day certificate.',
    url: 'https://veaglespace.com',
    siteName: 'Say No To Drugs Campaign',
    images: [
      {
        url: '/logo.webp',
        width: 800,
        height: 600,
        alt: 'Say No To Drugs - Veagle Space Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Say No to Drugs | Independence Day 2026 Pledge',
    description: 'Join the national movement to build a stronger, healthier India. Take the pledge to stay drug-free and receive your official certificate.',
    images: ['/logo.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
