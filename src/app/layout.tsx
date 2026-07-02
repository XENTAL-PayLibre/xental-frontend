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
const appName = 'Personal Trainer || FITCALL.ME';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appName,
    template: `%s · ${appName}`,
  },
  description:
    'Personal Trainer — Your dedicated fitness companion for personalized workouts and professional guidance.',
  icons: {
    icon: 'images/logo-icon.svg',
    shortcut: 'images/logo-icon.svg',
    apple: 'images/logo-icon.svg',
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
      className={`${interSans.variable} ${interMono.variable} h-full antialiased`}
    >
      <body className={cn(interSans.className, 'min-h-full flex flex-col')}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
