import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({ label, value, trend, trendValue, icon: Icon, iconColor }: Props) {
  const isUp = trend === 'up';
  return (
    <div className='bg-white rounded-xl border border-stroke-2 p-4 flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <span className='text-xs text-xental-text-primary-400'>{label}</span>
        <Icon className={cn('w-4 h-4', iconColor ?? 'text-action-blue')} />
      </div>
      <p className='text-2xl font-bold text-foreground'>{value}</p>
      <div className='flex items-center gap-1'>
        {isUp ? (
          <TrendingUp className='w-3.5 h-3.5 text-success' />
        ) : (
          <TrendingDown className='w-3.5 h-3.5 text-destructive' />
        )}
        <span className={cn('text-xs font-medium', isUp ? 'text-success' : 'text-destructive')}>
          {isUp ? '+' : ''}{trendValue}
        </span>
        <span className='text-xs text-xental-text-primary-400'>vs last month</span>
      </div>
    </div>
  );
}
