import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SuccessScreen() {
  return (
    <div className='flex items-center justify-center min-h-[320px]'>
      <div className='flex flex-col items-center text-center gap-3 p-12 border border-stroke-2 rounded-2xl bg-white max-w-sm w-full'>
        <div className='w-14 h-14 rounded-full border-4 border-action-blue/30 flex items-center justify-center'>
          <CheckCircle className='w-7 h-7 text-action-blue' />
        </div>
        <div>
          <h2 className='text-lg font-bold text-foreground'>
            Your account has been created successfully!
          </h2>
          <p className='text-sm text-xental-text-primary-400 mt-1'>
            Welcome to the future of finance
          </p>
        </div>
        <Button asChild className='mt-2 px-6'>
          <Link href='/dashboard'>Continue to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
