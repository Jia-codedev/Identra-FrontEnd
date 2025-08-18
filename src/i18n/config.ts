import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (typeof locale !== "string" || !(locales as readonly string[]).includes(locale)) notFound();

  try {
    const [
      common,
      auth,
      dashboard,
      masterData,
      employee,
      scheduling,
      settings,
      validation,
      chatbot,
      toast
    ] = await Promise.all([
      import(`./locales/${locale}/common.json`),
      import(`./locales/${locale}/auth.json`),
      import(`./locales/${locale}/dashboard.json`),
      import(`./locales/${locale}/master-data.json`),
      import(`./locales/${locale}/employee.json`),
      import(`./locales/${locale}/scheduling.json`),
      import(`./locales/${locale}/settings.json`),
      import(`./locales/${locale}/validation.json`),
      import(`./locales/${locale}/chatbot.json`),
      import(`./locales/${locale}/toast.json`),
      import(`./locales/${locale}/workflow.json`)
    ]);

    return {
      messages: {
        common: common.default,
        auth: auth.default,
        dashboard: dashboard.default,
        masterData: masterData.default,
        employee: employee.default,
        scheduling: scheduling.default,
        settings: settings.default,
        validation: validation.default,
        chatbot: chatbot.default,
        toast: toast.default,
        ...common.default,
        navigation: common.default.navigation,
        messages: common.default.messages,
        pagination: common.default.pagination,
        appearance: settings.default.appearance
      },
      locale
    };
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    notFound();
  }
});