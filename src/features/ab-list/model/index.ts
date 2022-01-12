import { combine } from 'effector'
import { AppOptionsService } from 'services/app-options'

const $appOptions = AppOptionsService.getStore()

export const $experiments = combine($appOptions, (store) => {
  return store.experiments || []
})
