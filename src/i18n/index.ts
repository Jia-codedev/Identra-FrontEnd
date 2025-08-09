
export { default as config, locales, defaultLocale, type Locale } from './config';
export { Link, redirect, usePathname, useRouter } from './client';
export { useTranslations, useLocale, useMessages } from 'next-intl';

export interface TranslationModules {
  common: any;
  auth: any;
  dashboard: any;
  masterData: any;
  employee: any;
  scheduling: any;
  settings: any;
  validation: any;
  chatbot: any;
  toast: any;
}

export const getAvailableModules = (): (keyof TranslationModules)[] => [
  'common',
  'auth', 
  'dashboard',
  'masterData',
  'employee',
  'scheduling',
  'settings',
  'validation',
  'chatbot',
  'toast'
];

export const moduleExists = (module: string): module is keyof TranslationModules => {
  return getAvailableModules().includes(module as keyof TranslationModules);
};
