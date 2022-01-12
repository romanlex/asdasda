import { combine, forward, Store } from 'effector'
import Cookies from 'js-cookie'
import { MessageFormatElement } from 'react-intl'
import { requestMeta } from 'server/controllers/react/model/store'
import { Storage } from 'shared/libs/storage'
import { DEFAULT_LANG } from '../constants'
import { messages, Messages } from '../messages'
import { determineUserLang } from '../utils'
import { domain } from './domain'
import { changeLocale } from './events'

function restoreLocale(): App.Locale {
  const locale = Storage.getItem('locale')
  if (locale) return locale as App.Locale

  return process.env.BUILD_TARGET === 'client'
    ? (determineUserLang(navigator.languages || []) as App.Locale)
    : (DEFAULT_LANG as App.Locale)
}

// TODO: remove unknown cast
const $userLocale: Store<App.Locale> = domain.createStore(restoreLocale())
const $messages: Store<Messages> = domain.createStore(messages)
const $currentMessages: Store<Record<string, string> | Record<string, MessageFormatElement[]>> = combine(
  $userLocale,
  $messages,
  (locale: App.Locale, messages) => messages[locale]
)
$userLocale.on(changeLocale, (_, value) => value)
const $i18n = combine({ userLocale: $userLocale, messages: $messages, currentMessages: $currentMessages })

$userLocale.watch(saveLocale)

if (process.env.BUILD_TARGET === 'server') {
  forward({ from: requestMeta.map(({ cookies }) => cookies.locale), to: $userLocale })
}

function saveLocale(locale: App.Locale) {
  Storage.setItem('locale', locale)
  Cookies.set('locale', locale)
}

export { $i18n }
