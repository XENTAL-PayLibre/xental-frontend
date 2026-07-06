import { z } from 'zod';

export const SignupSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Field is required' }).email({
      message: 'Invalid email address',
    }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(12, { message: 'Password must be at least 12 characters' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const LoginOtpSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Enter the 6-digit code' })
    .regex(/^\d{6}$/, { message: 'The code is 6 digits' }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Field is required' }).email({
    message: 'Invalid email address',
  }),
  password: z
    .string()
    .min(1, {
      message: 'Password is required',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    }),
});
