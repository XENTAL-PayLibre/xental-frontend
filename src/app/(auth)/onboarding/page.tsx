'use client';

import { useState } from 'react';
import Logo from '@/components/global/logo';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import BusinessDetailsStep, {
  type BusinessDetailsData,
} from '@/components/onboarding/steps/BusinessDetailsStep';
import BusinessVerificationStep, {
  type BusinessVerificationData,
} from '@/components/onboarding/steps/BusinessVerificationStep';
import AccountDetailsStep, {
  type AccountDetailsData,
} from '@/components/onboarding/steps/AccountDetailsStep';
import ReviewSubmitStep from '@/components/onboarding/steps/ReviewSubmitStep';
import SuccessScreen from '@/components/onboarding/SuccessScreen';

const initialBusinessDetails: BusinessDetailsData = {
  businessName: '',
  registrationNumber: '',
  businessType: '',
  industry: '',
  country: '',
  businessAddress: '',
  countryCode: '+234',
  phoneNumber: '',
  website: '',
};

const initialVerification: BusinessVerificationData = {
  certificate: null,
  proofOfAddress: null,
};

const initialAccountDetails: AccountDetailsData = {
  bankName: '',
  accountName: '',
  accountNumber: '',
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsData>(initialBusinessDetails);
  const [verification, setVerification] = useState<BusinessVerificationData>(initialVerification);
  const [accountDetails, setAccountDetails] = useState<AccountDetailsData>(initialAccountDetails);

  const handleNext = () => {
    setSubmitted(true);
    if (step === 1) {
      const required: (keyof BusinessDetailsData)[] = [
        'businessName', 'businessType', 'industry', 'country', 'businessAddress', 'phoneNumber',
      ];
      if (required.some((k) => !businessDetails[k])) return;
    }
    setSubmitted(false);
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: wire to POST /accounts/sub-accounts
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className='min-h-screen bg-xental-bg flex flex-col items-center justify-center px-4 py-12'>
        <div className='mb-8'>
          <Logo />
        </div>
        <SuccessScreen />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-xental-bg flex flex-col items-center px-4 py-10'>
      {/* Logo */}
      <div className='mb-8'>
        <Logo />
      </div>

      {/* Stepper */}
      <div className='w-full max-w-2xl'>
        <OnboardingStepper currentStep={step} />
      </div>

      {/* Form card */}
      <div className='w-full max-w-2xl bg-white rounded-2xl border border-stroke-2 p-8 shadow-sm'>
        {step === 1 && (
          <BusinessDetailsStep
            data={businessDetails}
            onChange={setBusinessDetails}
            onNext={handleNext}
            submitted={submitted}
          />
        )}
        {step === 2 && (
          <BusinessVerificationStep
            data={verification}
            onChange={setVerification}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <AccountDetailsStep
            data={accountDetails}
            onChange={setAccountDetails}
            onNext={handleNext}
            onBack={handleBack}
            submitted={submitted}
          />
        )}
        {step === 4 && (
          <ReviewSubmitStep
            businessDetails={businessDetails}
            verification={verification}
            accountDetails={accountDetails}
            onSubmit={handleSubmit}
            onBack={handleBack}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
