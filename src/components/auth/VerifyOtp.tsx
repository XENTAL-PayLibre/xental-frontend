import { Suspense } from 'react';
import AuthShell from './AuthShell';
import LoginContent from './LoginContent';
import VerifyOtpForm from './VerifyOtpForm';

export default function VerifyOtp() {
  return (
    <AuthShell
      left={<LoginContent />}
      right={
        <Suspense fallback={null}>
          <VerifyOtpForm />
        </Suspense>
      }
    />
  );
}
