import { i18n } from "@/next-i18next.config"

export const localeNames = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
}

export type LocaleCode = keyof typeof localeNames

export const defaultLocale = (i18n?.defaultLocale || "en") as LocaleCode

export const localeCurrencies = {
  de: "EUR",
  en: "USD",
  es: "EUR",
  fr: "EUR",
  pt: "EUR",
}

export const defaultCurrency = localeCurrencies[defaultLocale]
