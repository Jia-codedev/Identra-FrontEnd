"use client";

import { useLanguage } from '@/providers/language-provider';
import { useMemo } from 'react';

import enCommon from '@/i18n/locales/en/common.json';
import enLeaveManagement from '@/i18n/locales/en/leave-management.json';
import enAuth from '@/i18n/locales/en/auth.json';
import enDashboard from '@/i18n/locales/en/dashboard.json';
import enMasterData from '@/i18n/locales/en/master-data.json';
import enEmployee from '@/i18n/locales/en/employee.json';
import enScheduling from '@/i18n/locales/en/scheduling.json';
import enSettings from '@/i18n/locales/en/settings.json';
import enValidation from '@/i18n/locales/en/validation.json';
import enChatbot from '@/i18n/locales/en/chatbot.json';
import enToast from '@/i18n/locales/en/toast.json';
import enWorkflow from '@/i18n/locales/en/workflow.json';
import enTranslator from '@/i18n/locales/en/translator.json';

import arLeaveManagement from '@/i18n/locales/ar/leave-management.json';
import arCommon from '@/i18n/locales/ar/common.json';
import arAuth from '@/i18n/locales/ar/auth.json';
import arDashboard from '@/i18n/locales/ar/dashboard.json';
import arMasterData from '@/i18n/locales/ar/master-data.json';
import arEmployee from '@/i18n/locales/ar/employee.json';
import arScheduling from '@/i18n/locales/ar/scheduling.json';
import arSettings from '@/i18n/locales/ar/settings.json';
import arValidation from '@/i18n/locales/ar/validation.json';
import arChatbot from '@/i18n/locales/ar/chatbot.json';
import arToast from '@/i18n/locales/ar/toast.json';
import arWorkflow from '@/i18n/locales/ar/workflow.json';
import arTranslator from '@/i18n/locales/ar/translator.json';
const enTranslations = {
  common: enCommon,
  leaveManagement: enLeaveManagement,
  auth: enAuth,
  dashboard: enDashboard,
  masterData: enMasterData,
  workflow: enWorkflow || {},
  translator: enTranslator || {},
  employee: enEmployee,
  scheduling: enScheduling,
  settings: enSettings,
  validation: enValidation,
  chatbot: enChatbot,
  toast: enToast,
  search: enCommon.search,
  add: enCommon.add,
  edit: enCommon.edit,
  delete: enCommon.delete,
  save: enCommon.save,
  cancel: enCommon.cancel,
  loading: enCommon.loading,
  error: enCommon.error,
  success: enCommon.success,
  warning: enCommon.warning,
  navigation: enCommon.navigation,
  messages: enCommon.messages,
  pagination: enCommon.pagination,
  appearance: enSettings.appearance,
  employeeMaster: enEmployee.employeeMaster || {}
};

// If you have Arabic leave management translations, import and use them here
const arTranslations = {
  common: arCommon,
  leaveManagement: arLeaveManagement,
  auth: arAuth,
  dashboard: arDashboard,
  masterData: arMasterData,
  workflow: arWorkflow || {},
  translator: arTranslator || {},
  employee: arEmployee,
  scheduling: arScheduling,
  settings: arSettings,
  validation: arValidation,
  chatbot: arChatbot,
  toast: arToast,
  search: arCommon.search,
  add: arCommon.add,
  edit: arCommon.edit,
  delete: arCommon.delete,
  save: arCommon.save,
  cancel: arCommon.cancel,
  loading: arCommon.loading,
  error: arCommon.error,
  success: arCommon.success,
  warning: arCommon.warning,
  navigation: arCommon.navigation,
  messages: arCommon.messages,
  pagination: arCommon.pagination,
  appearance: arSettings.appearance
};

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export const useTranslations = () => {
  const { currentLocale, isInitialized } = useLanguage();

  const t = useMemo(() => {
    return (key: string, params?: Record<string, unknown>): string => {
      if (!isInitialized) {
        return key;
      }
      
      const keys = key.split('.');
      let value: unknown = translations[currentLocale as keyof typeof translations] || translations.en;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          value = translations.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
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
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param] !== undefined ? String(params[param]) : match;
        });
      }

      return value;
    };
  }, [currentLocale, isInitialized]);

  return { t, currentLocale, isInitialized };
}; 