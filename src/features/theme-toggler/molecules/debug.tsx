import { useStore } from 'effector-react/scope'

import { useFormatMessage } from 'services/i18n/react/hooks'
import { $prefersDark } from '../model/system-prefers'
import { $selectedTheme } from '../model/user-prefers'
import { ToggleThemeButton } from './theme-toggler'

export const ThemeDebugPanel = () => {
  const selectedTheme = useStore($selectedTheme)
  const prefersDark = useStore($prefersDark)
  const t = useFormatMessage()

  return (
    <div>
      <div suppressHydrationWarning>
        {t({
          id: 'app.home.themes.system.prefers',
        })}
        : {prefersDark ? 'yes' : 'no'}
      </div>
      <div>
        {t({
          id: 'app.home.themes.current',
        })}
        : {selectedTheme}
      </div>
      <div>
        {t({
          id: 'app.home.themes.switch',
        })}
        : <ToggleThemeButton />
      </div>
    </div>
  )
}
