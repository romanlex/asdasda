import { combine } from 'effector'
import { AppTheme } from 'namespaces/enums'
import { $prefersDark } from './system-prefers'
import { $selectedTheme } from './user-prefers'

export const $theme = combine($selectedTheme, $prefersDark, (selected, prefersDark) => {
  if (selected === AppTheme.auto) {
    return prefersDark ? AppTheme.dark : AppTheme.light
  }

  return selected
})

export const $isDark = $theme.map((theme) => theme === AppTheme.dark)
