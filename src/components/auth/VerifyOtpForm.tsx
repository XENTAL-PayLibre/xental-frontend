'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { LoginOtpSchema } from '@/schemas';
import { useVerifyLoginOtp } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const inputStyles =
  'h-11 text-muted-foreground text-base placeholder:text-base placeholder:text-muted px-4 tracking-[0.5em] text-center';
const labelStyles = 'text-muted-foreground text-sm';

const VerifyOtpForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const { mutate: verify, isPending } = useVerifyLoginOtp();

  const form = useForm<z.infer<typeof LoginOtpSchema>>({
    resolver: standardSchemaResolver(LoginOtpSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (values: z.infer<typeof LoginOtpSchema>) => {
    verify({ email, code: values.code });
  };

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>Enter your code</h1>
        <p className='mt-1 text-base text-muted'>
          We emailed a 6-digit code{email ? <> to <span className='font-medium'>{email}</span></> : null}. It expires in 10 minutes.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <FormField
            control={form.control}
            name='code'
            render={({ field, fieldState }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>Login code</FormLabel>
                <FormControl>
                  <Input
                    id='otp-code'
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    maxLength={6}
                    placeholder='••••••'
                    aria-invalid={!!fieldState.error}
                    className={cn(inputStyles)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            id='otp-submit'
            type='submit'
            disabled={isPending || !email}
            className='my-6 h-11 py-2.5 px-6 w-full text-sm bg-[#0063ED] font-semibold cursor-pointer'
          >
            {isPending ? 'Verifying…' : 'Verify and sign in'}
          </Button>
        </form>
      </Form>

      <p className='mt-4 text-center text-sm text-muted'>
        Didn&apos;t get a code?{' '}
        <Link href='/login' className='font-medium text-primary hover:underline'>
          Back to sign in
        </Link>
      </p>
    </>
  );
};

export default VerifyOtpForm;
