import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';
import SignupContent from './SignupContent';

export default function Signup() {
  return <AuthShell left={<SignupContent />} right={<SignupForm />} />;
}
