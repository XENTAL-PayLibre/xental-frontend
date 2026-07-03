import { AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'note' | 'warning' | 'tip';

const STYLES: Record<Variant, { wrap: string; icon: string; Icon: typeof Info }> = {
  note: { wrap: 'border-xental-blue-200 bg-xental-blue-50', icon: 'text-xental-blue-700', Icon: Info },
  warning: { wrap: 'border-status-pending-1-surface bg-[#fff7ed]', icon: 'text-status-pending-1', Icon: AlertTriangle },
  tip: { wrap: 'border-success-surface bg-success-surface', icon: 'text-success-dark', Icon: Lightbulb },
};

export function Callout({
  variant = 'note',
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  const s = STYLES[variant];
  return (
    <div className={cn('my-4 flex gap-3 rounded-lg border p-4', s.wrap)}>
      <s.Icon className={cn('mt-0.5 size-4.5 shrink-0', s.icon)} />
      <div className='min-w-0 text-sm leading-6 text-xental-text-primary-900'>
        {title && <p className='mb-1 font-semibold'>{title}</p>}
        <div className='text-xental-text-primary-500 [&_code]:rounded [&_code]:bg-white/70 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-foreground'>
          {children}
        </div>
      </div>
    </div>
  );
}
