import { useStore } from 'effector-react'
import { IntlProvider } from 'react-intl'
import { $i18n } from '../model/store'
import { DEFAULT_LANG } from '../constants'

interface I18nProviderI {
  children: React.ReactNode
}

export const I18nProvider = (props: I18nProviderI) => {
  const { userLocale, currentMessages } = useStore($i18n)
  return (
    <IntlProvider locale={userLocale} messages={currentMessages} defaultLocale={DEFAULT_LANG}>
      {props.children}
    </IntlProvider>
  )
}
