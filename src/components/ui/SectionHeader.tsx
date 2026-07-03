'use client';
import { cn } from '@/lib/utils';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  badge?: string;
  badgeClass?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  titleClass?: string;
}

const SectionHeader = ({
  badge,
  badgeClass,
  title,
  description,
  align = 'center',
  className,
  titleClass,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col md:mb-8',
        align === 'center'
          ? 'items-center text-center'
          : 'items-start text-left',
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            'mb-4 inline-flex items-center rounded-[9999px] bg-[#0063ED]/10 px-4 py-2 text-[14px] text-primary',
            badgeClass
          )}
        >
          {badge}
        </span>
      )}

      <h2
        className={cn(
          'text-3xl mb-6 font-semibold text-muted-foreground leading-[1.2] lg:text-5xl',
          titleClass
        )}
      >
        {title}
      </h2>

      {description && (
        <p className='text-sm text-muted leading-relaxed opacity-90 md:text-base'>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
