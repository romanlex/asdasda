import { createEvent, combine, forward, createStore } from 'effector'
import { Event, Store } from 'effector'
import { $theme } from 'features/theme-toggler'
import { themes } from 'shared/ui/themes'

export type Queries = {
  desktop: boolean
  extraLarge: boolean
  extraSmall: boolean
  large: boolean
  medium: boolean
  mobile: boolean
  portrait: boolean
  small: boolean
  tablet: boolean
}

export function mediaMatcher(query: (_theme: App.Theme) => string) {
  const queryChange: Event<MediaQueryListEvent> = createEvent()

  const mediaQueryListMatches = $theme.map((theme) => {
    if (process.env.BUILD_TARGET === 'client') {
      const mediaQueryList: MediaQueryList = window.matchMedia(query(themes[theme]))
      mediaQueryList.addEventListener('change', queryChange)

      return mediaQueryList.matches
    }

    return false
  })

  const store = createStore(false)

  forward({
    from: mediaQueryListMatches,
    to: store,
  })

  store.on(queryChange, (state, e) => e.matches)
  const isQueryMatches = store

  return isQueryMatches
}

export const screenQueries: Store<Queries> = combine({
  desktop: mediaMatcher((theme: App.Theme) => `(min-width: ${theme.breakpoints.m + 1}px)`),
  extraLarge: mediaMatcher((theme: App.Theme) => `(min-width: ${theme.breakpoints.l + 1}px)`),
  extraSmall: mediaMatcher((theme: App.Theme) => `(max-width: ${theme.breakpoints.xs}px)`),
  large: mediaMatcher(
    (theme: App.Theme) => `(min-width: ${theme.breakpoints.m + 1}px) and (max-width: ${theme.breakpoints.l}px)`
  ),
  medium: mediaMatcher(
    (theme: App.Theme) => `(min-width: ${theme.breakpoints.s + 1}px) and (max-width: ${theme.breakpoints.m}px)`
  ),
  mobile: mediaMatcher((theme: App.Theme) => `(max-width: ${theme.breakpoints.s}px)`),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  portrait: mediaMatcher((_theme: App.Theme) => `(orientation: portrait)`),
  small: mediaMatcher(
    (theme: App.Theme) => `(min-width: ${theme.breakpoints.xs + 1}px) and (max-width: ${theme.breakpoints.s}px)`
  ),
  tablet: mediaMatcher(
    (theme: App.Theme) => `(min-width: ${theme.breakpoints.s + 1}px) and (max-width: ${theme.breakpoints.m}px)`
  ),
})
