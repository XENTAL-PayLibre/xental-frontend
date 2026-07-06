import { CustomerDetailView } from '@/components/dashboard/customers/CustomerDetailView';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const accountRef = (await params).id;
  return <CustomerDetailView accountRef={accountRef} />;
}
