import { use } from 'react';
import OnboardingDetailView from '@/components/admin/OnboardingDetailView';

export default function TenantReviewPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = use(params);
  return <OnboardingDetailView tenantId={tenantId} />;
}
