import { i18n } from "@/next-i18next.config"
import { tr } from "date-fns/locale"

export const localeNames = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  tr: "Türkçe",
}

export type LocaleCode = keyof typeof localeNames

export const defaultLocale = (i18n?.defaultLocale || "en") as LocaleCode

export const localeCurrencies = {
  de: "EUR",
  en: "USD",
  es: "EUR",
  fr: "EUR",
  it: "EUR",
  pt: "EUR",
  tr: "TRY",
}

export const defaultCurrency = localeCurrencies[defaultLocale]
