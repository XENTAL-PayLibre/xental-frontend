'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { LoginSchema } from '@/schemas';
import { useLogin } from '@/api/auth';
import AuthShell from '@/components/auth/AuthShell';
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
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const inputStyles =
  'h-11 text-muted-foreground text-base placeholder:text-base placeholder:text-muted px-4';
const labelStyles = 'text-muted-foreground text-sm';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: standardSchemaResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    login(values);
  };
  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>Sign in</h1>
        <p className='mt-1 text-base text-muted'>
          Enter your details below to sign in
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>E-mail</FormLabel>
                <FormControl>
                  <Input
                    id='login-email'
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
                <div className='flex items-center justify-between'>
                  <FormLabel className={cn(labelStyles)}>Password</FormLabel>
                  {/* <Link
                    href='/forgot-password'
                    className='text-xs text-primary hover:underline'
                  >
                    Forgot password?
                  </Link> */}
                </div>
                <FormControl>
                  <div className='relative'>
                    <Input
                      id='login-password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='current-password'
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

          <Button
            id='login-submit'
            type='submit'
            disabled={isPending}
            className='my-6 h-11 py-2.5 px-6 w-full text-sm bg-[#0063ED] font-semibold cursor-pointer'
          >
            {isPending ? 'Signing in…' : 'Sign in with Email'}
          </Button>
        </form>
      </Form>

      <p className='mt-4 text-center text-sm text-muted'>
        By clicking continue, you agree to our{' '}
        <Link href='/terms' className='underline hover:text-foreground'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href='/privacy' className='underline hover:text-foreground'>
          Privacy Policy
        </Link>
      </p>

      <p className='mt-15 text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          href='/signup'
          className='font-medium text-muted-foreground hover:underline'
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
