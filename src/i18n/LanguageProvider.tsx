import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SUPPORTED_LANGUAGES } from './types';
import type { Language, NestedTranslationRecord } from './types';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { kn } from './translations/kn';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { ml } from './translations/ml';
import { bn } from './translations/bn';
import { LanguageContext } from './LanguageContext';

const STORAGE_KEY = 'smartpark_language';

const dictionaries: Record<Language, NestedTranslationRecord> = {
  en: en as unknown as NestedTranslationRecord,
  hi: hi as unknown as NestedTranslationRecord,
  kn: kn as unknown as NestedTranslationRecord,
  ta: ta as unknown as NestedTranslationRecord,
  te: te as unknown as NestedTranslationRecord,
  ml: ml as unknown as NestedTranslationRecord,
  bn: bn as unknown as NestedTranslationRecord,
};

function resolveKeyPath(obj: NestedTranslationRecord, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedLanguage = SUPPORTED_LANGUAGES.find(
        (option) => option.code === saved
      );

      if (savedLanguage) {
        return savedLanguage.code;
      }
    } catch {
      // ignore storage access errors
    }

    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage access errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (keyPath: string, vars?: Record<string, string | number>): string => {
      const currentDict = dictionaries[language] || dictionaries.en;
      let text = resolveKeyPath(currentDict, keyPath);

      // Fallback to English if translation is missing in selected language
      if (text === undefined && language !== 'en') {
        text = resolveKeyPath(dictionaries.en, keyPath);
      }

      if (text === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation key: "${keyPath}" for language "${language}"`);
        }
        return keyPath;
      }

      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = (text as string).replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return text;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};
