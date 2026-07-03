import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { LanguageProvider } from '@/components/docs/LanguageContext';
import { EnvironmentProvider, EnvironmentToggle } from '@/components/docs/EnvironmentContext';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnvironmentProvider>
      <LanguageProvider>
        <div className='mx-auto flex w-full max-w-[1400px] gap-8 px-4 sm:px-6 lg:px-8'>
          {/* Left: sidebar */}
          <aside className='sticky top-[72px] hidden h-[calc(100vh-72px)] w-60 shrink-0 overflow-y-auto py-8 pr-2 lg:block'>
            <div className='mb-6'>
              <p className='mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>
                Environment
              </p>
              <div className='px-3'>
                <EnvironmentToggle />
              </div>
            </div>
            <DocsSidebar />
          </aside>

          {/* Center: content */}
          <main className='min-w-0 flex-1 py-10'>{children}</main>
        </div>
      </LanguageProvider>
    </EnvironmentProvider>
  );
}
