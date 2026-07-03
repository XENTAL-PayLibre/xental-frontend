'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BusinessDetailsData } from './BusinessDetailsStep';
import type { BusinessVerificationData } from './BusinessVerificationStep';
import type { AccountDetailsData } from './AccountDetailsStep';
import type { DeveloperKycData } from './DeveloperKycStep';

interface Props {
  businessDetails: BusinessDetailsData;
  developerKyc: DeveloperKycData;
  verification: BusinessVerificationData;
  accountDetails: AccountDetailsData;
  onSubmit: (attestationAccepted: boolean) => void;
  onBack: () => void;
  loading?: boolean;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className='text-xs text-xental-text-primary-400 mb-0.5'>{label}</p>
      <p className='text-sm text-foreground font-medium'>{value}</p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className='text-base font-bold text-foreground mb-4'>{title}</h3>;
}

export default function ReviewSubmitStep({
  businessDetails: bd,
  developerKyc: dk,
  verification,
  accountDetails: ad,
  onSubmit,
  onBack,
  loading,
}: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      {/* Business Details */}
      <div className='mb-6'>
        <SectionTitle title='Business Details' />
        <p className='text-xs text-xental-text-primary-400 mb-4'>
          Provide your business details to start the KYB (Know Your Business) process
        </p>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          <ReviewRow label='Business name' value={bd.businessName} />
          <ReviewRow label='Business registration number' value={bd.registrationNumber} />
          <ReviewRow label='Business type' value={bd.businessType} />
          <ReviewRow label='Industry' value={bd.industry} />
          <ReviewRow label='Country' value={bd.country} />
          <ReviewRow label='Business address' value={bd.businessAddress} />
          <ReviewRow label='Country code' value={bd.countryCode} />
          <ReviewRow label='Phone Number' value={bd.phoneNumber} />
          <ReviewRow label='Website' value={bd.website} />
        </div>
        <p className='text-xs text-xental-text-primary-400 mt-4'>
          Ensure the information provided matches your legal documents
        </p>
      </div>

      {/* Personal verification (KYC) */}
      <div className='border-t border-stroke-2 pt-6 mb-6'>
        <SectionTitle title='Personal verification' />
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          <ReviewRow label='Full name' value={dk.fullName} />
          <ReviewRow label='Date of birth' value={dk.dateOfBirth} />
          <ReviewRow label='Country of residence' value={dk.country} />
          <ReviewRow label='Residential address' value={dk.address} />
          <ReviewRow label='ID type' value={dk.idType === 'Bvn' ? 'BVN' : dk.idType === 'Nin' ? 'NIN' : ''} />
          <ReviewRow label='ID number' value={dk.idNumber ? `••••••${dk.idNumber.slice(-3)}` : ''} />
          <ReviewRow label='Portfolio / website' value={dk.portfolioUrl} />
          <ReviewRow label='What are you building' value={dk.projectDescription} />
        </div>
      </div>

      <div className='border-t border-stroke-2 pt-6 mb-6'>
        <SectionTitle title='Business documents' />
        <div className='flex flex-col gap-2'>
          {[
            { label: verification.certificate?.file.name ?? 'Certificate.pdf', key: 'cert' },
            { label: verification.proofOfAddress?.file.name ?? 'Proof of Address.pdf', key: 'poa' },
          ].map(({ label, key }) => (
            <div key={key} className='flex items-center gap-3 border border-stroke-2 rounded-lg px-3 py-2.5'>
              <div className='w-7 h-7 bg-xental-bg rounded flex items-center justify-center'>
                <FileText className='w-4 h-4 text-xental-text-primary-400' />
              </div>
              <div className='flex-1'>
                <p className='text-xs font-medium text-foreground'>{label}</p>
                <p className='text-[10px] text-success'>Ready to upload</p>
              </div>
            </div>
          ))}
        </div>
        <p className='text-xs text-xental-text-primary-400 mt-4'>
          Documents are encrypted and stored securely. Verification typically takes 1 to 2 business
          days. You will be notified via email once the review is complete.
        </p>
      </div>

      <div className='border-t border-stroke-2 pt-6 mb-6'>
        <SectionTitle title='Settlement account' />
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          <ReviewRow label='Bank name' value={ad.bankName} />
          <div />
          <ReviewRow label='Account name' value={ad.accountName} />
          <ReviewRow label='Account number' value={ad.accountNumber} />
        </div>
      </div>

      {/* Attestation */}
      <label className='flex items-start gap-2 cursor-pointer'>
        <input
          type='checkbox'
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className='mt-0.5 accent-action-blue'
        />
        <span className='text-xs text-xental-text-primary-400'>
          I certify that the information provided is accurate and I agree to the Xental{' '}
          <span className='text-action-blue underline cursor-pointer'>Terms of Service</span> and{' '}
          <span className='text-action-blue underline cursor-pointer'>Privacy Policy</span>
        </span>
      </label>

      <div className='flex items-center justify-between mt-8'>
        <button
          onClick={onBack}
          className='text-sm text-xental-text-primary-500 hover:text-foreground transition-colors'
        >
          Back
        </button>
        <Button onClick={() => onSubmit(agreed)} disabled={!agreed || loading} className='px-8'>
          {loading ? 'Submitting…' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
