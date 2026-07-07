'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { AdminLoginSchema } from '@/schemas';
import { useAdminLogin } from '@/api/admin';
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
import { useRouter } from 'next/navigation';

const inputStyles =
  'h-11 text-muted-foreground text-base placeholder:text-base placeholder:text-muted px-4';
const labelStyles = 'text-muted-foreground text-sm';

const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending } = useAdminLogin();

  const form = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: standardSchemaResolver(AdminLoginSchema),
    defaultValues: { email: '', password: '', totpCode: '' },
  });

  const onSubmit = (values: z.infer<typeof AdminLoginSchema>) => {
    login(values, {
      onSuccess: () => {
        router.push('/admin/reconciliation');
      }
    });
  };
  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-semibold text-foreground'>Admin Portal</h1>
        <p className='mt-1 text-base text-muted'>
          Sign in to the Xental Admin Dashboard
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

          {/* TOTP Code */}
          <FormField
            control={form.control}
            name='totpCode'
            render={({ field }) => (
              <FormItem className='gap-2'>
                <FormLabel className={cn(labelStyles)}>2FA Code (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='123456'
                    className={cn(inputStyles)}
                  />
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

    </>
  );
};

export default AdminLoginForm;
