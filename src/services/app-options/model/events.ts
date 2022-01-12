import { Event, Effect, guard } from 'effector'
import { api } from 'services/api'
import { domain } from './domain'

export const updateAppOptions: Event<App.AppOptions> = domain.createEvent('update app options')

export const getAppOptions: Event<void> = domain.createEvent('get app options')

export const getAppOptionsFx: Effect<void, App.AppOptions> = domain.createEffect('get app options', {
  async handler() {
    const req = await api('/internal/api/app_options')
    const result = (await req.json()) as App.AppOptions
    return result
  },
})

guard({
  source: getAppOptions,
  filter: getAppOptionsFx.pending.map((pending) => !pending),
  target: getAppOptionsFx,
})
