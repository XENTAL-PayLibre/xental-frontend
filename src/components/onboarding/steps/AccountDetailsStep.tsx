'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NIGERIAN_BANKS, bankByName } from '@/lib/banks';

export interface AccountDetailsData {
  bankName: string;
  bankCode: string;
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

  const setBank = (name: string) =>
    onChange({ ...data, bankName: name, bankCode: bankByName(name)?.code ?? '' });

  const err = (key: keyof AccountDetailsData) => submitted && !data[key];

  const acctValid = /^\d{10}$/.test(data.accountNumber);
  const canProceed = REQUIRED.every((k) => !!data[k]) && acctValid;

  return (
    <div>
      <h2 className='text-xl font-bold text-foreground mb-1'>Settlement account</h2>
      <p className='text-sm text-xental-text-primary-400 mb-6'>
        Add the bank account where your collected payments will be settled. We run a NUBAN
        name-match check, so the account name must match your KYC details.
      </p>

      <div className='flex flex-col gap-4'>
        <div>
          <label className='block text-xs font-medium text-xental-text-primary-500 mb-1'>
            Bank name<span className='text-action-blue ml-0.5'>*</span>
          </label>
          <div className='relative'>
            <select
              value={data.bankName}
              onChange={(e) => setBank(e.target.value)}
              className={cn(
                'w-full h-10 px-3 pr-8 rounded-lg border text-sm outline-none appearance-none bg-white transition-colors focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
                data.bankName ? 'text-foreground' : 'text-xental-text-primary-400',
                err('bankName') ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
              )}
            >
              <option value='' disabled>Select your bank</option>
              {NIGERIAN_BANKS.map((b) => <option key={b.code} value={b.name}>{b.name}</option>)}
            </select>
            <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xental-text-primary-400 pointer-events-none' />
          </div>
        </div>

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
            onChange={(v) => set('accountNumber')(v.slice(0, 10))}
            placeholder='10-digit NUBAN'
            error={submitted && (!data.accountNumber || !acctValid)}
            numbersOnly
          />
        </div>
      </div>
      {submitted && data.accountNumber && !acctValid && (
        <p className='text-[10px] text-destructive mt-1.5'>Account number must be exactly 10 digits.</p>
      )}

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
