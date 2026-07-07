import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  let bg = 'bg-[#FEF3F2]';
  let text = 'text-[#B42318]';

  if (['verified', 'approved', 'passed', 'active'].includes(s)) {
    bg = 'bg-[#ECFDF3]';
    text = 'text-[#027A48]';
  } else if (['pending', 'underreview', 'inforequested', 'warning'].includes(s)) {
    bg = 'bg-[#FFFAEB]';
    text = 'text-[#B54708]';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium',
        bg,
        text,
        className
      )}
    >
      {status}
    </span>
  );
}
