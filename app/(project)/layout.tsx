import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Micro Saas',
  description: 'Welcome to the Micro SaaS application',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
