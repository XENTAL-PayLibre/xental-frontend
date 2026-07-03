'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DOCS_ENVIRONMENTS, DOCS_API_BASE } from '@/lib/docs/openapi';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'xnt-docs-env';
const DEFAULT = DOCS_ENVIRONMENTS[0].id;

interface EnvCtx {
  env: string;
  base: string;
  setEnv: (id: string) => void;
}

const Ctx = createContext<EnvCtx>({ env: DEFAULT, base: DOCS_API_BASE, setEnv: () => {} });

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [env, setEnvState] = useState<string>(DEFAULT);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && DOCS_ENVIRONMENTS.some((e) => e.id === stored)) setEnvState(stored);
  }, []);

  const setEnv = (id: string) => {
    setEnvState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  };

  const base = DOCS_ENVIRONMENTS.find((e) => e.id === env)?.base ?? DOCS_API_BASE;
  return <Ctx.Provider value={{ env, base, setEnv }}>{children}</Ctx.Provider>;
}

export const useEnvironment = () => useContext(Ctx);

/** Live / Sandbox pill toggle. */
export function EnvironmentToggle({ className }: { className?: string }) {
  const { env, setEnv } = useEnvironment();
  return (
    <div className={cn('inline-flex rounded-lg border border-border bg-card p-0.5', className)}>
      {DOCS_ENVIRONMENTS.map((e) => (
        <button
          key={e.id}
          onClick={() => setEnv(e.id)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            env === e.id ? 'bg-primary text-primary-foreground' : 'text-xental-text-primary-500 hover:text-foreground',
          )}
        >
          {e.label}
        </button>
      ))}
    </div>
  );
}
