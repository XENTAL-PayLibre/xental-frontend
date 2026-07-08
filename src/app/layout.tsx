import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Provider from './provider';
import { cn } from '@/lib/utils';

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
});

const interMono = JetBrains_Mono({
  variable: '--font-inter-mono',
  subsets: ['latin'],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const appName = 'Xental';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${appName} — Fintech Infrastructure for Modern Businesses`,
    template: `%s · ${appName}`,
  },
  description:
    'Xental is the fintech infrastructure layer that powers payments, settlements, and financial operations for modern businesses. Accept payments, reconcile in real time, and scale with confidence.',
  icons: {
    icon: '/images/logo-icon.svg',
    shortcut: '/images/logo-icon.svg',
    apple: '/images/logo-icon.svg',
  },
  openGraph: {
    title: `${appName} — Fintech Infrastructure for Modern Businesses`,
    description: 'The fintech infrastructure layer that powers payments, settlements, and financial operations for modern businesses.',
    siteName: appName,
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Xental' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} — Fintech Infrastructure for Modern Businesses`,
    description: 'The fintech infrastructure layer that powers payments, settlements, and financial operations for modern businesses.',
    images: ['/images/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${interSans.variable} ${interMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className={cn(interSans.className, 'min-h-full flex flex-col')}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
