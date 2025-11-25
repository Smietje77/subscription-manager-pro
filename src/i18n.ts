import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'nl', 'fr', 'de', 'es', 'it'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Always use 'en' as default, don't throw notFound()
  const selectedLocale = (locale && locales.includes(locale as Locale) ? locale : 'en') as Locale;

  return {
    locale: selectedLocale,
    messages: (await import(`../public/locales/${selectedLocale}/common.json`)).default,
  };
});
