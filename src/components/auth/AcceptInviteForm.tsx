'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAcceptInvite } from '@/api/team';
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
  'h-11 text-muted-foreground text-base placeholder:text-base placeholder:text-muted px-4';
const labelStyles = 'text-muted-foreground text-sm';

const AcceptInviteSchema = z
  .object({
    password: z
      .string()
      .min(12, 'Use at least 12 characters.')
      .max(128, 'Password is too long.'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

const AcceptInviteForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: accept, isPending } = useAcceptInvite();

  const form = useForm<z.infer<typeof AcceptInviteSchema>>({
    resolver: standardSchemaResolver(AcceptInviteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (values: z.infer<typeof AcceptInviteSchema>) => {
    if (!token) {
      toast.error('This invitation link is missing its token.');
      return;
    }
    accept(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success('Your account is ready. Please sign in.');
          router.push('/login');
        },
      },
    );
  };

  if (!token) {
    return (
      <div className='text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>Invalid invitation</h1>
        <p className='mt-2 text-base text-muted'>
          This link is missing its invitation token. Ask the account owner to resend your invite.
        </p>
        <Link
          href='/login'
          className='mt-6 inline-block text-sm font-medium text-[#0063ED] hover:underline'
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>Accept your invitation</h1>
        <p className='mt-1 text-base text-muted'>
          Set a password to activate your account, then sign in.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field, fieldState }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      id='invite-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='At least 12 characters'
                      autoComplete='new-password'
                      aria-invalid={!!fieldState.error}
                      className={cn(inputStyles)}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((p) => !p)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff size={16} className='text-muted' />
                      ) : (
                        <Eye size={16} className='text-muted' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field, fieldState }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    id='invite-confirm-password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Re-enter your password'
                    autoComplete='new-password'
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
            id='invite-submit'
            type='submit'
            disabled={isPending}
            className='my-6 h-11 py-2.5 px-6 w-full text-sm bg-[#0063ED] font-semibold cursor-pointer'
          >
            {isPending ? 'Activating…' : 'Accept invite'}
          </Button>
        </form>
      </Form>

      <p className='mt-4 text-center text-sm text-muted-foreground'>
        Already activated?{' '}
        <Link href='/login' className='font-medium text-muted-foreground hover:underline'>
          Sign in
        </Link>
      </p>
    </>
  );
};

export default AcceptInviteForm;
