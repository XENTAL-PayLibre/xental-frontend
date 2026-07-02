import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Create an account — Xental',
  description:
    'Sign up for Xental and start automating payment collection with dedicated virtual accounts.',
};

type AuthStep = { step: number; label: string; active: boolean };

const STEPS: AuthStep[] = [
  { step: 1, label: 'Sign up your account', active: true },
  { step: 2, label: 'Verify your business', active: false },
  { step: 3, label: 'Set up your settlement account', active: false },
];

export default function SignupPage() {
  return (
    <AuthShell>
      <p>form goes here</p>
    </AuthShell>
  );
}
