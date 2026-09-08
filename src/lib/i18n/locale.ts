export type Locale = "en" | "mn";

export const LOCALES: Locale[] = ["en", "mn"];
export const DEFAULT_LOCALE: Locale = "mn";
export const LOCALE_STORAGE_KEY = "locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "mn";
}

export function bcp47(locale: Locale): string {
  return locale === "mn" ? "mn-MN" : "en-US";
}
