import AuthShell from './AuthShell';
import LoginContent from './LoginContent';
import LoginForm from './LoginForm';

export default function Login() {
  return <AuthShell left={<LoginContent />} right={<LoginForm />} />;
}
