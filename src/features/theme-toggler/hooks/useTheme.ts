import { useEvent, useStore } from 'effector-react/scope'
import { $selectedTheme, themeToggled } from '../model/user-prefers'

export const useTheme = () => {
  const theme = useStore($selectedTheme)

  return { theme, toggle: useEvent(themeToggled) }
}
