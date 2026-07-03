'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
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
import { SignupSchema } from '@/schemas';
import { useSignup } from '@/api/auth';
import { cn } from '@/lib/utils';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: signup, isPending } = useSignup();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: standardSchemaResolver(SignupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    // confirmPassword is UI-only — strip before sending to backend
    const { confirmPassword: _, ...payload } = values;
    signup(payload);
  };

  const inputStyles =
    'h-11 text-muted-foreground text-base placeholder:text-base placeholder:text-muted px-4';
  const labelStyles = 'text-muted-foreground text-sm';

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>
          Create an account
        </h1>
        <p className='mt-1 text-base text-muted'>
          Enter your details below to sign up
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6'
        >
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>Full name</FormLabel>
                <FormControl>
                  <Input
                    id='signup-name'
                    type='text'
                    placeholder='John Doe'
                    autoComplete='name'
                    className={cn(inputStyles)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>E-mail</FormLabel>
                <FormControl>
                  <Input
                    id='signup-email'
                    type='email'
                    placeholder='name@example.com'
                    autoComplete='email'
                    className={cn(inputStyles)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      id='signup-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      aria-invalid={!!fieldState.error}
                      className={cn(inputStyles)}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((p) => !p)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field, fieldState }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      id='signup-confirm-password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      aria-invalid={!!fieldState.error}
                      className={cn(inputStyles)}
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                      aria-label={
                        showPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                    >
                      {showConfirmPassword ? (
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

          <Button
            id='signup-submit'
            type='submit'
            disabled={isPending}
            className='my-4 h-11 py-2.5 px-6 w-full text-sm bg-[#0063ED] font-semibold cursor-pointer'
          >
            {isPending ? 'Creating account…' : 'Sign up with Email'}
          </Button>
        </form>
      </Form>

      <p className='mt-2 text-center text-sm text-muted'>
        By clicking continue, you agree to our{' '}
        <Link href='/terms' className='underline hover:text-foreground'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href='/privacy' className='underline hover:text-foreground'>
          Privacy Policy
        </Link>
      </p>

      <p className='mt-10 text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='font-medium text-muted-foreground hover:underline'
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
