import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && totalItems === 0) return null;

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-stroke-2', className)}>
      <span className='text-xs text-xental-text-primary-400'>
        {totalItems} total
      </span>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40 transition-colors'
        >
          Previous
        </button>
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-6 h-6 rounded text-xs font-medium transition-colors',
              p === currentPage
                ? 'bg-action-blue text-white'
                : 'text-xental-text-primary-500 hover:bg-xental-bg'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages || 1, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40 transition-colors'
        >
          Next
        </button>
      </div>
    </div>
  );
}
