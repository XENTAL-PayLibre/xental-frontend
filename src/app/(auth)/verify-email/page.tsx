import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export const metadata = {
  title: 'Check Your Email – Xental',
  description: 'Verify your Xental account email address.',
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <div className='flex min-h-screen items-center justify-center bg-xental-bg px-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-10 border text-center'>
        {/* Brand logo */}
        <div className='mb-8 flex justify-center'>
          <Image
            src='/images/full-logo.svg'
            alt='Xental'
            width={140}
            height={40}
            unoptimized
          />
        </div>

        {/* Icon */}
        <div className='mb-6 flex justify-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <Mail size={40} className='text-primary' strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className='text-2xl font-semibold text-foreground'>
          Check your email
        </h1>

        {/* Body */}
        <p className='mt-3 text-base text-muted leading-relaxed'>
          We sent a verification link to{' '}
          {email ? (
            <span className='font-medium text-foreground'>{email}</span>
          ) : (
            'your email address'
          )}
          . Click the link to verify your account and sign in.
        </p>

        {/* CTA */}
        <div className='mt-8 flex flex-col gap-3'>
          <Button
            asChild
            variant='outline'
            className='h-11 w-full text-sm font-semibold'
          >
            <Link href='/login'>Return to sign in</Link>
          </Button>

          <p className='text-sm text-muted-foreground mt-4'>
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href='/signup' className='text-primary hover:underline'>
              try another email address
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
