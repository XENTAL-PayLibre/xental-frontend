import AuthShell from '@/components/auth/AuthShell';
import LoginContent from '@/components/auth/LoginContent';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return <AuthShell left={<LoginContent />} right={<AdminLoginForm />} />;
}
