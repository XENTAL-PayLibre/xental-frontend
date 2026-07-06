import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Verified' | 'N/A' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isVerified = status === 'Verified';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium',
        isVerified
          ? 'bg-[#ECFDF3] text-[#027A48]'
          : 'bg-[#FEF3F2] text-[#B42318]', // N/A styles
        className
      )}
    >
      {status}
    </span>
  );
}
