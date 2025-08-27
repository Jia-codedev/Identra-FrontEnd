"use client";

import { useLanguage } from '@/providers/language-provider';
import { useMemo } from 'react';

import enAll from '@/i18n/locales/en/all.json';
import arAll from '@/i18n/locales/ar/all.json';

type Messages = Record<string, unknown>;

function buildLocale(allMessages: Messages) {
  const all = (allMessages || {}) as Record<string, unknown>;
  const common = (all.common as Record<string, unknown>) || {};
  const settings = (all.settings as Record<string, unknown>) || {};
  const employee = (all.employee as Record<string, unknown>) || {};
  const mainMenuWrapper = (all.mainMenu as Record<string, unknown>) || {};
  const mainMenu = (mainMenuWrapper as any).mainMenu || {};

  return {
    ...all,
    mainMenu,
    search: (common as any).search,
    add: (common as any).add,
    edit: (common as any).edit,
    delete: (common as any).delete,
    save: (common as any).save,
    cancel: (common as any).cancel,
    loading: (common as any).loading,
    error: (common as any).error,
    success: (common as any).success,
    warning: (common as any).warning,
    navigation: (common as any).navigation,
    messages: (common as any).messages,
    pagination: (common as any).pagination,
    appearance: (settings as any).appearance,
    employeeMaster: (employee as any).employeeMaster || {},
  } as Record<string, unknown>;
}

const translations = {
  en: buildLocale(enAll as Messages),
  ar: buildLocale(arAll as Messages),
};

export const useTranslations = () => {
  const { currentLocale, isInitialized } = useLanguage();

  const t = useMemo(() => {
    return (key: string, params?: Record<string, unknown>): string => {
      const fallbackValueFrom = !isInitialized
        ? (translations.en as Record<string, unknown>)
        : ((translations[currentLocale as keyof typeof translations] as Record<string, unknown>) || (translations.en as Record<string, unknown>));

      const keys = key.split('.');
      let value: unknown = fallbackValueFrom;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
          value = (value as Record<string, unknown>)[k];
        } else {
          value = translations.en as Record<string, unknown>;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in (value as Record<string, unknown>)) {
              value = (value as Record<string, unknown>)[fallbackKey];
            } else {
              return key;
            }
          }
          break;
        }
      }
      if (typeof value !== 'string') {
        return key;
      }
      if (params) {
        return (value as string).replace(/\{(\w+)\}/g, (match, param) => {
          return (params as Record<string, unknown>)[param] !== undefined ? String((params as Record<string, unknown>)[param]) : match;
        });
      }

      return value as string;
    };
  }, [currentLocale, isInitialized]);

  return { t, currentLocale, isInitialized };
};