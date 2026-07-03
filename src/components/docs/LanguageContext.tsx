'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LANGUAGES } from '@/lib/docs/code-samples';

const STORAGE_KEY = 'xnt-docs-lang';
const DEFAULT = LANGUAGES[0].id;

interface LanguageCtx {
  language: string;
  setLanguage: (id: string) => void;
}

const Ctx = createContext<LanguageCtx>({ language: DEFAULT, setLanguage: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(DEFAULT);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.id === stored)) setLanguageState(stored);
  }, []);

  const setLanguage = (id: string) => {
    setLanguageState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  };

  return <Ctx.Provider value={{ language, setLanguage }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
