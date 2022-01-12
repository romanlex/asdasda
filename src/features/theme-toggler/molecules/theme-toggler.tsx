import { useTheme } from '../hooks/useTheme'

const themeEmoji = {
  dark: '🌚',
  light: '🌝',
  auto: '🌗',
}

export const ToggleThemeButton = () => {
  const { theme, toggle } = useTheme()

  return (
    <button
      type='button'
      onClick={() => {
        toggle()
      }}>
      {themeEmoji[theme]}
    </button>
  )
}
