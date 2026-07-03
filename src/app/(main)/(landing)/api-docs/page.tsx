import { redirect } from 'next/navigation';

// Legacy path — redirects to the canonical /documentation URL.
export default function ApiDocsPage() {
  redirect('/documentation');
}
