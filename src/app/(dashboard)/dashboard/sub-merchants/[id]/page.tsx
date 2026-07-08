import { SubMerchantDetailView } from '@/components/dashboard/sub-merchants/SubMerchantDetailView';

export default async function SubMerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubMerchantDetailView id={id} />;
}
