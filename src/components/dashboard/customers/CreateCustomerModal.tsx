'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { Copy, CheckCircle2 } from 'lucide-react';
import { CreateCustomerSchema } from '@/schemas';
import { useCreateVirtualAccount } from '@/api/virtual-accounts';
import { useSubMerchantsList } from '@/api/sub-merchants';
import type { VirtualAccountResponse } from '@/api/types/dashboard';
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
  const { data: subMerchants = [] } = useSubMerchantsList();
  const [created, setCreated] = useState<VirtualAccountResponse | null>(null);

  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: standardSchemaResolver(CreateCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      expectedAmount: 0,
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
        // The form takes naira; the API expects kobo.
        ...(values.expectedAmount && values.expectedAmount > 0
          ? { expectedAmountKobo: Math.round(values.expectedAmount * 100) }
          : {}),
        ...(values.expiryDateUtc ? { expiryDateUtc: values.expiryDateUtc } : {}),
        ...(values.subMerchantRef ? { subMerchantRef: values.subMerchantRef } : {}),
      },
      {
        onSuccess: (response) => {
          form.reset();
          // Show the provisioned NUBAN so the merchant can share where to pay.
          setCreated(response);
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    setCreated(null);
    onClose();
  };

  const copy = (label: string, value?: string | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => toast.success(`${label} copied`));
  };

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  if (created) {
    const rows: Array<{ label: string; value: string | null }> = [
      { label: 'Bank', value: created.bankName },
      { label: 'Account Number', value: created.accountNumber },
      { label: 'Account Name', value: created.accountName },
    ];
    return (
      <Modal open={open} onClose={handleClose} title='Customer Created' className='max-w-lg'>
        <div className='mt-2 space-y-4'>
          <div className='flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400'>
            <CheckCircle2 className='h-4 w-4 shrink-0' />
            <span>Share these details with the customer to receive their pay-in.</span>
          </div>
          <div className='divide-y divide-stroke-2 rounded-lg border border-stroke-2'>
            {rows.map((r) => (
              <div key={r.label} className='flex items-center justify-between gap-3 px-3 py-2.5'>
                <div className='min-w-0'>
                  <p className='text-[11px] uppercase tracking-wide text-muted-foreground'>{r.label}</p>
                  <p className='truncate text-sm font-medium text-foreground'>{r.value || '—'}</p>
                </div>
                {r.value ? (
                  <button
                    type='button'
                    onClick={() => copy(r.label, r.value)}
                    className='shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-stroke-2/40 hover:text-foreground'
                    aria-label={`Copy ${r.label}`}
                  >
                    <Copy className='h-4 w-4' />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {created.expectedAmountKobo ? (
            <p className='text-xs text-muted-foreground'>
              Expected amount: ₦{(created.expectedAmountKobo / 100).toLocaleString()}
            </p>
          ) : null}
          <div className='flex justify-end pt-1'>
            <Button type='button' onClick={handleClose}>Done</Button>
          </div>
        </div>
      </Modal>
    );
  }

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
              name='expectedAmount'
              render={({ field }) => (
                <FormItem>
                  <label className='mb-1 block text-xs font-medium text-foreground'>
                    Expected Amount (₦)
                  </label>
                  <FormControl>
                    <input
                      type='number'
                      min='0'
                      step='0.01'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  Sub-Merchant (Optional)
                </label>
                <FormControl>
                  <select {...field} value={field.value || ''} className={inputClass}>
                    <option value=''>None — settle to my main account</option>
                    {subMerchants.map((sm) => (
                      <option key={sm.id} value={sm.reference ?? ''}>
                        {sm.name}{sm.reference ? ` (${sm.reference})` : ''}
                      </option>
                    ))}
                  </select>
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
