'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AccountDetailsData {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface Props {
  data: AccountDetailsData;
  onChange: (data: AccountDetailsData) => void;
  onNext: () => void;
  onBack: () => void;
  submitted: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  numbersOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  numbersOnly?: boolean;
}) {
  return (
    <div>
      <label className='block text-xs font-medium text-xental-text-primary-500 mb-1'>
        {label}
        {required && <span className='text-action-blue ml-0.5'>*</span>}
      </label>
      <input
        type='text'
        inputMode={numbersOnly ? 'numeric' : 'text'}
        value={value}
        onChange={(e) => onChange(numbersOnly ? e.target.value.replace(/\D/g, '') : e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors placeholder:text-xental-text-primary-400 focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
          error ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
        )}
      />
    </div>
  );
}

const REQUIRED: (keyof AccountDetailsData)[] = ['bankName', 'accountName', 'accountNumber'];

export default function AccountDetailsStep({ data, onChange, onNext, onBack, submitted }: Props) {
  const set = (key: keyof AccountDetailsData) => (v: string) =>
    onChange({ ...data, [key]: v });

  const err = (key: keyof AccountDetailsData) => submitted && !data[key];

  const canProceed = REQUIRED.every((k) => !!data[k]);

  return (
    <div>
      <h2 className='text-xl font-bold text-foreground mb-1'>Account details</h2>
      <p className='text-sm text-xental-text-primary-400 mb-6'>
        Add the bank account where your collected payments will be settled
      </p>

      <div className='flex flex-col gap-4'>
        <Field
          label='Bank name'
          required
          value={data.bankName}
          onChange={set('bankName')}
          placeholder='Enter bank name'
          error={err('bankName')}
        />

        <div className='grid grid-cols-2 gap-4'>
          <Field
            label='Account name'
            required
            value={data.accountName}
            onChange={set('accountName')}
            placeholder='Enter account name'
            error={err('accountName')}
          />
          <Field
            label='Account number'
            required
            value={data.accountNumber}
            onChange={set('accountNumber')}
            placeholder='Enter account number'
            error={err('accountNumber')}
            numbersOnly
          />
        </div>
      </div>

      <div className='flex items-center justify-between mt-8'>
        <button
          onClick={onBack}
          className='text-sm text-xental-text-primary-500 hover:text-foreground transition-colors'
        >
          Back
        </button>
        <Button onClick={onNext} className='px-8' disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  );
}
