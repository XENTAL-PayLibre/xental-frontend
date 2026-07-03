'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const BUSINESS_TYPES = [
  'Sole proprietorship',
  'Partnership',
  'Private Liability Company (Ltd)',
  'Limited Liability Company (LLP)',
  'Non-Governmental Organization (NGO)',
  'Non-Profit Organisation (NPO)',
  'Educational Institution',
  'Religious Organization',
  'Government Agency',
  'Other',
];

const INDUSTRIES = [
  'Education',
  'Real Estate',
  'Retail & E-commerce',
  'Finance',
  'Healthcare',
  'Non-Profit',
  'Technology',
  'Other',
];

export const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
  'Congo, Democratic Republic of the', 'Congo, Republic of the', 'Djibouti',
  'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
  'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya',
  'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali',
  'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
  'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
  'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan',
  'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
];

const COUNTRY_CODES: Record<string, string> = {
  Algeria: '+213', Angola: '+244', Benin: '+229', Botswana: '+267',
  'Burkina Faso': '+226', Burundi: '+257', 'Cabo Verde': '+238',
  Cameroon: '+237', 'Central African Republic': '+236', Chad: '+235',
  Comoros: '+269', 'Congo, Democratic Republic of the': '+243',
  'Congo, Republic of the': '+242', Djibouti: '+253', Egypt: '+20',
  'Equatorial Guinea': '+240', Eritrea: '+291', Eswatini: '+268',
  Ethiopia: '+251', Gabon: '+241', Gambia: '+220', Ghana: '+233',
  Guinea: '+224', 'Guinea-Bissau': '+245', 'Ivory Coast': '+225',
  Kenya: '+254', Lesotho: '+266', Liberia: '+231', Libya: '+218',
  Madagascar: '+261', Malawi: '+265', Mali: '+223', Mauritania: '+222',
  Mauritius: '+230', Morocco: '+212', Mozambique: '+258', Namibia: '+264',
  Niger: '+227', Nigeria: '+234', Rwanda: '+250',
  'Sao Tome and Principe': '+239', Senegal: '+221', Seychelles: '+248',
  'Sierra Leone': '+232', Somalia: '+252', 'South Africa': '+27',
  'South Sudan': '+211', Sudan: '+249', Tanzania: '+255', Togo: '+228',
  Tunisia: '+216', Uganda: '+256', Zambia: '+260', Zimbabwe: '+263',
};

export interface BusinessDetailsData {
  businessName: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  businessAddress: string;
  countryCode: string;
  phoneNumber: string;
  website: string;
}

interface Props {
  data: BusinessDetailsData;
  onChange: (data: BusinessDetailsData) => void;
  onNext: () => void;
  submitted: boolean;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className='block text-xs font-medium text-xental-text-primary-500 mb-1'>
      {label}{required && <span className='text-action-blue ml-0.5'>*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  className,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors placeholder:text-xental-text-primary-400 focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
        error ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2',
        className
      )}
    />
  );
}

function SelectInput({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  error?: boolean;
}) {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full h-10 px-3 pr-8 rounded-lg border text-sm outline-none appearance-none bg-white transition-colors focus:border-action-blue focus:ring-2 focus:ring-action-blue/20',
          value ? 'text-foreground' : 'text-xental-text-primary-400',
          error ? 'border-destructive ring-2 ring-destructive/20' : 'border-stroke-2'
        )}
      >
        <option value='' disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xental-text-primary-400 pointer-events-none' />
    </div>
  );
}

const REQUIRED: (keyof BusinessDetailsData)[] = [
  'businessName', 'registrationNumber', 'businessType', 'industry', 'country', 'businessAddress', 'phoneNumber',
];

export default function BusinessDetailsStep({ data, onChange, onNext, submitted }: Props) {
  const set = (key: keyof BusinessDetailsData) => (value: string) =>
    onChange({ ...data, [key]: value });

  const handleCountryChange = (country: string) => {
    onChange({
      ...data,
      country,
      countryCode: COUNTRY_CODES[country] ?? data.countryCode,
    });
  };

  const handlePhoneChange = (v: string) => {
    onChange({ ...data, phoneNumber: v.replace(/\D/g, '') });
  };

  const isEmpty = (key: keyof BusinessDetailsData) =>
    submitted && REQUIRED.includes(key) && !data[key];

  const canProceed = REQUIRED.every((k) => !!data[k]);

  return (
    <div>
      <h2 className='text-xl font-bold text-foreground mb-1'>Business Details</h2>
      <p className='text-sm text-xental-text-primary-400 mb-6'>
        Provide your business details to start the KYB (Know Your Business) process
      </p>

      <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
        <div>
          <FieldLabel label='Business name' required />
          <TextInput
            value={data.businessName}
            onChange={set('businessName')}
            placeholder='Enter your business name'
            error={isEmpty('businessName')}
          />
        </div>

        <div>
          <FieldLabel label='Business registration number' required />
          <TextInput
            value={data.registrationNumber}
            onChange={set('registrationNumber')}
            placeholder='Enter your business registration number'
            error={isEmpty('registrationNumber')}
          />
        </div>

        <div>
          <FieldLabel label='Business type' required />
          <SelectInput
            value={data.businessType}
            onChange={set('businessType')}
            placeholder='Select business type'
            options={BUSINESS_TYPES}
            error={isEmpty('businessType')}
          />
        </div>

        <div>
          <FieldLabel label='Industry' required />
          <SelectInput
            value={data.industry}
            onChange={set('industry')}
            placeholder='Select industry'
            options={INDUSTRIES}
            error={isEmpty('industry')}
          />
        </div>

        <div>
          <FieldLabel label='Country' required />
          <SelectInput
            value={data.country}
            onChange={handleCountryChange}
            placeholder='Select country'
            options={AFRICAN_COUNTRIES}
            error={isEmpty('country')}
          />
        </div>

        <div>
          <FieldLabel label='Business address' required />
          <TextInput
            value={data.businessAddress}
            onChange={set('businessAddress')}
            placeholder='Enter your business address'
            error={isEmpty('businessAddress')}
          />
        </div>

        <div>
          <FieldLabel label='Phone Number' required />
          <div className='flex gap-2'>
            <div className={cn(
              'flex items-center h-10 px-3 rounded-lg border text-sm bg-xental-bg text-xental-text-primary-500 shrink-0 w-16 justify-center font-medium',
              isEmpty('phoneNumber') ? 'border-destructive' : 'border-stroke-2'
            )}>
              {data.countryCode || '+?'}
            </div>
            <TextInput
              value={data.phoneNumber}
              onChange={handlePhoneChange}
              placeholder='Enter your phone number'
              error={isEmpty('phoneNumber')}
              className='flex-1'
            />
          </div>
        </div>

        <div>
          <FieldLabel label='Website' />
          <TextInput
            value={data.website}
            onChange={set('website')}
            placeholder='www.yourbusiness.com'
            type='url'
          />
        </div>
      </div>

      <p className='text-xs text-xental-text-primary-400 mt-5'>
        Ensure the information provided matches your legal documents
      </p>

      <div className='flex items-center justify-between mt-6'>
        <button className='text-sm text-xental-text-primary-500 hover:text-foreground transition-colors'>
          Back
        </button>
        <Button onClick={onNext} className='px-8' disabled={!canProceed}>
          Next
        </Button>
      </div>
    </div>
  );
}
