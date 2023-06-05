import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'

export const compactNumbers = (num: number, compact: boolean = false) => {
  let options = {}

  if (compact && num >= 1e3)
    options = { notation: 'compact', compactDisplay: 'short' }
  return num.toLocaleString('en-US', options)
}
