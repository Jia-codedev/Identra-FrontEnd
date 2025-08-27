import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (
    typeof locale !== "string" ||
    !(locales as readonly string[]).includes(locale)
  )
    notFound();
  try {
    try {
      const all = await import(`./locales/${locale}/all.json`);
      const allMessages = all.default as any;
      if (allMessages?.common || allMessages?.settings) {
        return {
          messages: {
            common: allMessages.common ?? {},
            auth: allMessages.auth ?? {},
            dashboard: allMessages.dashboard ?? {},
            masterData: allMessages.masterData ?? {},
            employee: allMessages.employee ?? {},
            scheduling: allMessages.scheduling ?? {},
            settings: allMessages.settings ?? {},
            validation: allMessages.validation ?? {},
            chatbot: allMessages.chatbot ?? {},
            toast: allMessages.toast ?? {},
            ...(allMessages.common ?? {}),
            navigation: allMessages.common?.navigation ?? {},
            messages: allMessages.common?.messages ?? {},
            pagination: allMessages.common?.pagination ?? {},
            appearance: allMessages.settings?.appearance ?? {},
            workflow: allMessages.workflow ?? {},
            translator: allMessages.translator ?? {},
            leaveManagement: allMessages.leaveManagement ?? {},
            mainMenu: allMessages.mainMenu ?? {},
          },
          locale,
        };
      }
      return { messages: allMessages, locale };
    } catch (_) {
    }

    return {
      locale,
    };
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    notFound();
  }
});
