import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  icon: string | ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function StatCard({ icon, label, value, onClick, isActive }: Props) {
  const content = (
    <>
      {typeof icon === 'string' ? (
        <Image src={icon} alt={label} width={32} height={32} priority />
      ) : (
        icon
      )}
      <div>
        <p className='text-base text-muted'>{label}</p>
        <p className='text-2xl font-medium text-foreground'>{value}</p>
      </div>
    </>
  );

  const baseClasses = cn(
    'bg-white rounded-xl border p-6 flex flex-col gap-6 text-left transition-all',
    isActive ? 'border-action-blue ring-1 ring-action-blue' : 'border-stroke-2'
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={cn(baseClasses, 'hover:border-action-blue/50 w-full')}>
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
