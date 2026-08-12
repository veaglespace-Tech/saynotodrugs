import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import ReduxProvider from '../components/ReduxProvider';

export const metadata = {
  title: 'Veagle Social Impact Platform',
  description: 'Digital Pledge & Donation Platform',
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
