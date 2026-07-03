import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{ verified?: string }>;
}

export const metadata = {
  title: 'Email Verification – Xental',
  description: 'Verify your Xental account email address.',
};

export default async function EmailVerifiedPage({ searchParams }: Props) {
  const { verified } = await searchParams;
  const isSuccess = verified === 'true';

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
          {isSuccess ? (
            <CheckCircle
              size={64}
              strokeWidth={1.5}
              className='text-success'
            />
          ) : (
            <XCircle
              size={64}
              strokeWidth={1.5}
              className='text-destructive'
            />
          )}
        </div>

        {/* Heading */}
        <h1 className='text-2xl font-semibold text-foreground'>
          {isSuccess ? 'Email verified!' : 'Verification failed'}
        </h1>

        {/* Body */}
        <p className='mt-3 text-base text-muted'>
          {isSuccess
            ? 'Your account has been activated. You can now sign in to Xental.'
            : 'The verification link is invalid or has expired. Please register again or contact support.'}
        </p>

        {/* CTA */}
        <div className='mt-8'>
          {isSuccess ? (
            <Button
              asChild
              className='h-11 w-full text-sm font-semibold'
            >
              <Link href='/login'>Sign in to your account</Link>
            </Button>
          ) : (
            <div className='flex flex-col gap-3'>
              <Button
                asChild
                className='h-11 w-full text-sm font-semibold'
              >
                <Link href='/signup'>Create a new account</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='h-11 w-full text-sm'
              >
                <Link href='/login'>Back to sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
