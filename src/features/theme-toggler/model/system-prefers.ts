import { createEvent, restore, Event, Store } from 'effector'

const matcher = process.env.BUILD_TARGET === 'client' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const prefersChanged: Event<boolean> = createEvent()

export const $prefersDark: Store<boolean> = restore(
  prefersChanged,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.BUILD_TARGET === 'client' ? matcher!.matches : false
)

if (process.env.BUILD_TARGET === 'client') {
  matcher?.addEventListener('change', (event) => {
    prefersChanged(event.matches)
  })
}
