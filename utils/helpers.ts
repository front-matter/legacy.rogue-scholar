import "@formatjs/intl-numberformat/polyfill"
import "@formatjs/intl-numberformat/locale-data/en"
import "@formatjs/intl-numberformat/locale-data/de"
import "@formatjs/intl-numberformat/locale-data/es"
import "@formatjs/intl-numberformat/locale-data/pt"
import "@formatjs/intl-numberformat/locale-data/fr"
import "@formatjs/intl-numberformat/locale-data/it"
import "@formatjs/intl-numberformat/locale-data/tr"

export const compactNumbers = (num: number, compact: boolean = false) => {
  let options = {}

  if (compact && num >= 1e3)
    options = { notation: "compact", compactDisplay: "short" }
  return num.toLocaleString("en-US", options)
}

export const formatNumbers = (num: number, locale: string = "en") => {
  return num.toLocaleString(locale)
}
