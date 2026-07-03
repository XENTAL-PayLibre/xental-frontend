import { cn } from '@/lib/utils';

/** Shared long-form typography for guide pages (no typography plugin needed). */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-foreground',
        '[&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground',
        '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground',
        '[&_p]:mt-4 [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-xental-text-primary-500',
        '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:text-xental-text-primary-500',
        '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-[15px] [&_ol]:text-xental-text-primary-500',
        '[&_li]:leading-7',
        '[&_strong]:font-semibold [&_strong]:text-foreground',
        '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-accent [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[13px] [&_:not(pre)>code]:text-accent-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}
