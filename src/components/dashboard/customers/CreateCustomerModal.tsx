'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { CreateCustomerSchema } from '@/schemas';
import { useCreateVirtualAccount } from '@/api/virtual-accounts';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface CreateCustomerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCustomerModal({ open, onClose }: CreateCustomerModalProps) {
  const createCustomer = useCreateVirtualAccount();

  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: standardSchemaResolver(CreateCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      expectedAmountKobo: 0,
      expiryDateUtc: '',
      subMerchantRef: '',
    },
  });

  const onSubmit = (values: z.infer<typeof CreateCustomerSchema>) => {
    createCustomer.mutate(
      {
        // accountRef is omitted — the backend generates a unique reference.
        name: values.name,
        email: values.email,
        phone: values.phone,
        ...(values.expectedAmountKobo && values.expectedAmountKobo > 0
          ? { expectedAmountKobo: values.expectedAmountKobo }
          : {}),
        ...(values.expiryDateUtc ? { expiryDateUtc: values.expiryDateUtc } : {}),
        ...(values.subMerchantRef ? { subMerchantRef: values.subMerchantRef } : {}),
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title='Create Customer (Virtual Account)'
      className='max-w-lg'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <label className='mb-1 block text-xs font-medium text-foreground'>
                  Full Name <span className='text-destructive'>*</span>
                </label>
                <FormControl>
                  <input {...field} placeholder='John Doe' className={inputClass} />
                </FormControl>
                <FormMessage className='text-[10px]' />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <label className='mb-1 block text-xs font-medium text-foreground'>
                    Email <span className='text-destructive'>*</span>
                  </label>
                  <FormControl>
                    <input type='email' {...field} placeholder='john@example.com' className={inputClass} />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <label className='mb-1 block text-xs font-medium text-foreground'>
                    Phone <span className='text-destructive'>*</span>
                  </label>
                  <FormControl>
                    <input
                      type='tel'
                      {...field}
                      placeholder='+234...'
                      className={inputClass}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[\d+\-()\s]*$/.test(val)) {
                          field.onChange(e);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='expectedAmountKobo'
              render={({ field }) => (
                <FormItem>
                  <label className='mb-1 block text-xs font-medium text-foreground'>
                    Expected Amount (Kobo)
                  </label>
                  <FormControl>
                    <input
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder='0'
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='expiryDateUtc'
              render={({ field }) => (
                <FormItem>
                  <label className='mb-1 block text-xs font-medium text-foreground'>
                    Expiry Date
                  </label>
                  <FormControl>
                    <input
                      type='datetime-local'
                      {...field}
                      value={field.value ? field.value.slice(0, 16) : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          field.onChange('');
                          return;
                        }
                        try {
                          const d = new Date(val);
                          if (!isNaN(d.getTime())) {
                            field.onChange(d.toISOString());
                          }
                        } catch (_) {}
                      }}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className='text-[10px]' />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='subMerchantRef'
            render={({ field }) => (
              <FormItem>
                <label className='mb-1 block text-xs font-medium text-foreground'>
                  Sub-Merchant Reference (Optional)
                </label>
                <FormControl>
                  <input {...field} value={field.value || ''} placeholder='SUB-MERCH-456' className={inputClass} />
                </FormControl>
                <FormMessage className='text-[10px]' />
              </FormItem>
            )}
          />

          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={createCustomer.isPending}>
              {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
