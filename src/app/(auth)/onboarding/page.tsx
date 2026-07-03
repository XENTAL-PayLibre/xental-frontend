'use client';

import { useState } from 'react';
import Logo from '@/components/global/logo';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import BusinessDetailsStep, {
  type BusinessDetailsData,
} from '@/components/onboarding/steps/BusinessDetailsStep';
import DeveloperKycStep, {
  type DeveloperKycData,
} from '@/components/onboarding/steps/DeveloperKycStep';
import BusinessVerificationStep, {
  type BusinessVerificationData,
} from '@/components/onboarding/steps/BusinessVerificationStep';
import AccountDetailsStep, {
  type AccountDetailsData,
} from '@/components/onboarding/steps/AccountDetailsStep';
import ReviewSubmitStep from '@/components/onboarding/steps/ReviewSubmitStep';
import SuccessScreen from '@/components/onboarding/SuccessScreen';
import {
  useSubmitDeveloperKyc,
  useSubmitBusinessKyb,
  useUploadKycDocument,
  useSubmitOnboarding,
} from '@/api/onboarding';
import { displayError } from '@/api/auth';
import { toast } from 'sonner';

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

const initialDeveloperKyc: DeveloperKycData = {
  fullName: '',
  dateOfBirth: '',
  country: '',
  address: '',
  idType: '',
  idNumber: '',
  portfolioUrl: '',
  projectDescription: '',
};

const initialVerification: BusinessVerificationData = {
  certificate: null,
  proofOfAddress: null,
};

const initialAccountDetails: AccountDetailsData = {
  bankName: '',
  bankCode: '',
  accountName: '',
  accountNumber: '',
};

const LAST_STEP = 5;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsData>(initialBusinessDetails);
  const [developerKyc, setDeveloperKyc] = useState<DeveloperKycData>(initialDeveloperKyc);
  const [verification, setVerification] = useState<BusinessVerificationData>(initialVerification);
  const [accountDetails, setAccountDetails] = useState<AccountDetailsData>(initialAccountDetails);

  const submitDeveloper = useSubmitDeveloperKyc();
  const submitBusiness = useSubmitBusinessKyb();
  const uploadDoc = useUploadKycDocument();
  const submitOnboarding = useSubmitOnboarding();
  const loading =
    submitDeveloper.isPending || submitBusiness.isPending || uploadDoc.isPending || submitOnboarding.isPending;

  const handleNext = () => {
    setSubmitted(false);
    setStep((s) => Math.min(s + 1, LAST_STEP));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (attestationAccepted: boolean) => {
    if (!attestationAccepted) return;

    const cert = verification.certificate?.file;
    const poa = verification.proofOfAddress?.file;
    if (!cert || !poa) {
      toast.error('Please upload both your Certificate of Incorporation and Proof of Address.');
      setStep(3);
      return;
    }

    try {
      // 1) Developer KYC (identity + regulatory id + payout bank)
      await submitDeveloper.mutateAsync({
        fullName: developerKyc.fullName.trim(),
        dateOfBirth: developerKyc.dateOfBirth,
        country: developerKyc.country,
        address: developerKyc.address.trim(),
        idType: developerKyc.idType as 'Bvn' | 'Nin',
        idNumber: developerKyc.idNumber,
        bankName: accountDetails.bankName,
        bankCode: accountDetails.bankCode,
        bankAccountName: accountDetails.accountName.trim(),
        bankAccountNumber: accountDetails.accountNumber,
        portfolioUrl: developerKyc.portfolioUrl.trim() || undefined,
        projectDescription: developerKyc.projectDescription.trim() || undefined,
      });

      // 2) Business KYB (business info + settlement account)
      await submitBusiness.mutateAsync({
        legalName: businessDetails.businessName.trim(),
        registrationNumber: businessDetails.registrationNumber.trim(),
        businessType: businessDetails.businessType,
        industry: businessDetails.industry,
        country: businessDetails.country,
        address: businessDetails.businessAddress.trim(),
        contactCountryCode: businessDetails.countryCode,
        contactPhone: businessDetails.phoneNumber,
        website: businessDetails.website.trim() || undefined,
        settlementBankName: accountDetails.bankName,
        settlementBankCode: accountDetails.bankCode,
        settlementAccountName: accountDetails.accountName.trim(),
        settlementAccountNumber: accountDetails.accountNumber,
      });

      // 3) Documents (multipart, one per type)
      await uploadDoc.mutateAsync({ type: 'CertificateOfIncorporation', file: cert });
      await uploadDoc.mutateAsync({ type: 'ProofOfAddress', file: poa });

      // 4) Attest + submit for review
      await submitOnboarding.mutateAsync(attestationAccepted);

      setDone(true);
    } catch (err) {
      displayError(err, 'We couldn’t submit your onboarding. Please review your details and try again.');
    }
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
          <DeveloperKycStep
            data={developerKyc}
            onChange={setDeveloperKyc}
            onNext={handleNext}
            onBack={handleBack}
            submitted={submitted}
          />
        )}
        {step === 3 && (
          <BusinessVerificationStep
            data={verification}
            onChange={setVerification}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <AccountDetailsStep
            data={accountDetails}
            onChange={setAccountDetails}
            onNext={handleNext}
            onBack={handleBack}
            submitted={submitted}
          />
        )}
        {step === 5 && (
          <ReviewSubmitStep
            businessDetails={businessDetails}
            developerKyc={developerKyc}
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
