import { BaseService } from 'services/base'
import { DEFAULT_LANG, SUPPORTED_LANGS } from './constants'
import { changeLocale } from './model/events'
import { $i18n } from './model/store'
import { I18nProvider } from './react/i18n-provider'

type StoreService = typeof $i18n

class I18nService<T extends StoreService> extends BaseService<StoreService> {
  DEFAULT_LANG = DEFAULT_LANG
  SUPPORTED_LANGS = SUPPORTED_LANGS
  changeLocale = changeLocale
  constructor(store: T) {
    super(store)
  }

  Provider = I18nProvider

  getMessages() {
    return this.state.messages
  }

  getSupportedLocales = () => {
    return this.SUPPORTED_LANGS
  }
}

const service = new I18nService($i18n)

export { service as I18nService }
