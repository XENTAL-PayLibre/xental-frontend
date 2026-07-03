import { cn } from '@/lib/utils';

const STYLES: Record<string, string> = {
  get: 'bg-xental-blue-50 text-xental-blue-700',
  post: 'bg-success-surface text-success-dark',
  put: 'bg-status-pending-1-surface/20 text-status-pending-1',
  patch: 'bg-status-exceptions-surface text-status-exceptions',
  delete: 'bg-failed-surface text-failed',
};

export function MethodBadge({ method, className }: { method: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide',
        STYLES[method] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {method}
    </span>
  );
}
