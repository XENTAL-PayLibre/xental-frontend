'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { AFRICAN_COUNTRIES } from './BusinessDetailsStep';

export interface DeveloperKycData {
  fullName: string;
  dateOfBirth: string;          // yyyy-MM-dd
  country: string;
  address: string;
  idType: 'Bvn' | 'Nin' | '';
  idNumber: string;             // 11 digits
  portfolioUrl: string;
  projectDescription: string;
}

interface Props {
  data: DeveloperKycData;
  onChange: (data: DeveloperKycData) => void;
  onNext: () => void;
  onBack: () => void;
  submitted: boolean;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className='block text-xs font-medium text-xental-text-primary-500 mb-1'>
      {label}{required && <span className='text-action-blue ml-0.5'>*</span>}
    </label>
  );
}

const inputCls = (error?: boolean) =>
  cn(
    'w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors placeholder:text-xental-text-primary-400 focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
    error ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
  );

const REQUIRED: (keyof DeveloperKycData)[] = [
  'fullName', 'dateOfBirth', 'country', 'address', 'idType', 'idNumber',
];

export default function DeveloperKycStep({ data, onChange, onNext, onBack, submitted }: Props) {
  const set = (key: keyof DeveloperKycData) => (v: string) => onChange({ ...data, [key]: v });

  const idValid = /^\d{11}$/.test(data.idNumber);
  const isEmpty = (key: keyof DeveloperKycData) => submitted && REQUIRED.includes(key) && !data[key];
  const idError = submitted && (!data.idNumber || !idValid);

  const canProceed = REQUIRED.every((k) => !!data[k]) && idValid;

  return (
    <div>
      <h2 className='text-xl font-bold text-foreground mb-1'>Personal verification</h2>
      <p className='text-sm text-xental-text-primary-400 mb-6'>
        Complete your identity (KYC) as the account owner. This is required before you can go live.
      </p>

      <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
        <div>
          <FieldLabel label='Full name' required />
          <input
            value={data.fullName}
            onChange={(e) => set('fullName')(e.target.value)}
            placeholder='As it appears on your ID'
            className={inputCls(isEmpty('fullName'))}
          />
        </div>

        <div>
          <FieldLabel label='Date of birth' required />
          <input
            type='date'
            value={data.dateOfBirth}
            onChange={(e) => set('dateOfBirth')(e.target.value)}
            className={inputCls(isEmpty('dateOfBirth'))}
          />
        </div>

        <div>
          <FieldLabel label='Country of residence' required />
          <div className='relative'>
            <select
              value={data.country}
              onChange={(e) => set('country')(e.target.value)}
              className={cn(
                'w-full h-10 px-3 pr-8 rounded-lg border text-sm outline-none appearance-none bg-white transition-colors focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
                data.country ? 'text-foreground' : 'text-xental-text-primary-400',
                isEmpty('country') ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
              )}
            >
              <option value='' disabled>Select country</option>
              {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xental-text-primary-400 pointer-events-none' />
          </div>
        </div>

        <div>
          <FieldLabel label='Residential address' required />
          <input
            value={data.address}
            onChange={(e) => set('address')(e.target.value)}
            placeholder='Enter your home address'
            className={inputCls(isEmpty('address'))}
          />
        </div>

        <div>
          <FieldLabel label='ID type' required />
          <div className='relative'>
            <select
              value={data.idType}
              onChange={(e) => set('idType')(e.target.value)}
              className={cn(
                'w-full h-10 px-3 pr-8 rounded-lg border text-sm outline-none appearance-none bg-white transition-colors focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
                data.idType ? 'text-foreground' : 'text-xental-text-primary-400',
                isEmpty('idType') ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
              )}
            >
              <option value='' disabled>Select ID type</option>
              <option value='Bvn'>BVN (Bank Verification Number)</option>
              <option value='Nin'>NIN (National Identity Number)</option>
            </select>
            <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xental-text-primary-400 pointer-events-none' />
          </div>
        </div>

        <div>
          <FieldLabel label='ID number' required />
          <input
            value={data.idNumber}
            onChange={(e) => set('idNumber')(e.target.value.replace(/\D/g, '').slice(0, 11))}
            inputMode='numeric'
            placeholder='11-digit number'
            className={inputCls(idError)}
          />
          {submitted && data.idNumber && !idValid && (
            <p className='text-[10px] text-destructive mt-1'>Must be exactly 11 digits.</p>
          )}
        </div>

        <div>
          <FieldLabel label='Portfolio / website URL' />
          <input
            value={data.portfolioUrl}
            onChange={(e) => set('portfolioUrl')(e.target.value)}
            placeholder='https://…'
            type='url'
            className={inputCls(false)}
          />
        </div>

        <div className='col-span-2'>
          <FieldLabel label='What are you building?' />
          <textarea
            value={data.projectDescription}
            onChange={(e) => set('projectDescription')(e.target.value)}
            placeholder='Briefly describe your product or use case'
            rows={3}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors placeholder:text-xental-text-primary-400 focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 border-stroke-2 resize-none'
            )}
          />
        </div>
      </div>

      <p className='text-xs text-xental-text-primary-400 mt-5'>
        We run an automated BVN/NIN check — make sure your name and ID match your records.
      </p>

      <div className='flex items-center justify-between mt-6'>
        <button onClick={onBack} className='text-sm text-xental-text-primary-500 hover:text-foreground transition-colors'>
          Back
        </button>
        <Button onClick={onNext} className='px-8' disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  );
}
