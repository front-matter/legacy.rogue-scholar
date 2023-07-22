import { i18n } from "@/next-i18next.config"

export const localeNames = {
  de: "Deutsch",
  en: "English",
  es: "Español",
}

export type LocaleCode = keyof typeof localeNames

export const defaultLocale = (i18n?.defaultLocale || "en") as LocaleCode

export const localeCurrencies = {
  de: "EUR",
  en: "USD",
  es: "EUR",
}

export const defaultCurrency = localeCurrencies[defaultLocale]
