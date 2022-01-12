import { AppLocale } from 'namespaces/enums'

export const SERVICE_NAME = 'service.i18n'
export const DEFAULT_LANG = process.env.LOCALE || AppLocale.ru

interface SupportedLangs {
  [AppLocale.en]: string
  [AppLocale.ru]: string
}

export const SUPPORTED_LANGS: SupportedLangs = {
  [AppLocale.en]: 'English',
  [AppLocale.ru]: 'Russia',
}
