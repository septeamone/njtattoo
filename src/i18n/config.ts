// Route segments are EN / KR / RU. `htmlLang` is the BCP-47 tag for <html lang>
// (Korean is "ko"; :lang(ko) typesetting rules depend on it).
export const locales = ["en", "kr", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const htmlLang: Record<Locale, string> = { en: "en", kr: "ko", ru: "ru" };

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** The landing is one page; these are its sections, in reading order (each has the id of the same name). */
export const sections = ["styles", "artist", "process", "contact"] as const;
export type Section = (typeof sections)[number];

/** Every route ends with a slash (static export, trailingSlash: true). */
export const href = (lang: Locale) => `/${lang}/`;
