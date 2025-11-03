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
      return { messages: allMessages, locale };
    } catch (_) {}
    return {
      locale,
    };
  } catch (error) {
    notFound();
  }
});
