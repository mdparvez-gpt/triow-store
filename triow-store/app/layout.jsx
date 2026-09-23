import { Cormorant_Garamond, Inter } from 'next/font/google';
import { StoreProvider } from '@/context/StoreContext';
import Shell from '@/components/Shell';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: { default: 'TrioW | Triow On. Style On.', template: '%s | TrioW' },
  description:
    'TrioW is a premium clothing brand from Bangladesh. Heavyweight tees, polos, hoodies and jackets with cash on delivery nationwide.',
};

export const viewport = {
  themeColor: '#121212',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
