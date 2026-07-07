import { use } from 'react';
import ReconciliationDetailView from '@/components/admin/ReconciliationDetailView';

export default function ReconciliationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReconciliationDetailView id={id} />;
}
