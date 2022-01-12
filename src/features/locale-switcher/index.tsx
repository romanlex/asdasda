import { useStore } from 'effector-react'
import { useEvent } from 'effector-react/scope'
import { useCallback } from 'react'
import { I18nService } from 'services/i18n'
import { useFormatMessage } from 'services/i18n/react/hooks'

const supportedLocales = I18nService.getSupportedLocales()

export const LocaleSwitcher = () => {
  const { userLocale } = useStore(I18nService.getStore())
  const t = useFormatMessage()
  const scopedChangeHandler = useEvent(I18nService.changeLocale)
  const selectHandler = useCallback((e) => {
    scopedChangeHandler((e.target as HTMLSelectElement).value as App.Locale)
  }, [])

  return (
    <div>
      <h1>{t({ id: 'app.home.locales.title' })}</h1>
      <div>
        {t({ id: 'app.home.locales.value' })}: {userLocale}
      </div>
      <div>
        {t({ id: 'app.home.locales.choose' })}:{' '}
        <select name='locale' id='' defaultValue={userLocale} onChange={selectHandler}>
          {Object.keys(supportedLocales).map((key) => (
            <option key={key} value={key}>
              {supportedLocales[key]}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />
    </div>
  )
}
