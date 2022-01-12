import { createEvent, createStore, Store, Event, forward } from 'effector'
import Cookies from 'js-cookie'
import { AppTheme } from 'namespaces/enums'
import { Storage } from 'shared/libs/storage'
import { requestMeta } from 'server/controllers/react/model/store'

export const themeToggled: Event<void> = createEvent()
const availableThemes: App.ThemeAlias[] = [AppTheme.light, AppTheme.dark, AppTheme.auto]

export const $selectedTheme: Store<App.ThemeAlias> = createStore(restoreTheme())

$selectedTheme.on(themeToggled, (state) => {
  const currentIndex = availableThemes.findIndex((theme) => theme === state)
  const nextIndex = (currentIndex + 1) % availableThemes.length
  return availableThemes[nextIndex]
})

$selectedTheme.watch(saveTheme)

function restoreTheme(): App.ThemeAlias {
  const theme = Storage.getItem('theme')
  for (const available of availableThemes) {
    if (available === theme) {
      return available
    }
  }
  return AppTheme.auto
}

if (process.env.BUILD_TARGET === 'server') {
  forward({ from: requestMeta.map(({ cookies }) => cookies.theme), to: $selectedTheme })
}

function saveTheme(theme: App.ThemeAlias) {
  Storage.setItem('theme', theme)
  Cookies.set('theme', theme)
}
