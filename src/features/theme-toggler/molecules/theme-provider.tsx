import { useStore } from 'effector-react/scope'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useEffect } from 'react'
import { AppTheme } from 'namespaces/enums'
import { $isDark } from '../model'

type ProviderProps = {
  // eslint-disable-next-line no-unused-vars
  themes: { [key in Exclude<AppTheme, AppTheme.auto>]: App.Theme }
  children: React.ReactNode
}

export const ThemeProvider = ({ themes, children }: ProviderProps) => {
  const isDark = useStore($isDark)

  useEffect(() => {
    const html = document.querySelector('html')
    if (html) {
      html.dataset.theme = isDark ? 'dark' : 'light'
    }
  }, [isDark])

  return <StyledThemeProvider theme={isDark ? themes.dark : themes.light}>{children}</StyledThemeProvider>
}
