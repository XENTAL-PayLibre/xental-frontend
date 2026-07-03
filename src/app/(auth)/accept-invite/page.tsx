import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import AcceptInviteForm from '@/components/auth/AcceptInviteForm';

export default function AcceptInvitePage() {
  return (
    <AuthShell
      right={
        <Suspense fallback={<div className='text-center text-sm text-muted'>Loading…</div>}>
          <AcceptInviteForm />
        </Suspense>
      }
    />
  );
}
