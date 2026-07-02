import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Log in — Xental',
  description: 'Log in to your Xental account.',
};

export default function LoginPage() {
  return (
    <AuthShell>
      <p>form goes here</p>
    </AuthShell>
  );
}
