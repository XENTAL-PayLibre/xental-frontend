import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  icon: string;
  label: string;
  value: string;
}

export default function StatCard({ icon, label, value }: Props) {
  return (
    <div className=' bg-white rounded-xl border border-stroke-2 p-6 flex flex-col gap-6'>
      <Image src={icon} alt={label} width={32} height={32} priority />
      <div>
        <p className='text-base text-muted'>{label}</p>
        <p className='text-2xl font-medium text-foreground'>{value}</p>
      </div>
    </div>
  );
}
