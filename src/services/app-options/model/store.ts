import { UserData } from '@foxford/foxford-js-sdk'
import { Store } from 'effector'
import { CurrencyCode } from 'namespaces/enums'
import { FoxfordService } from 'services/foxford'
import { SERVICE_NAME } from '../constants'
import { domain } from './domain'
import { getAppOptionsFx, updateAppOptions } from './events'

export const DEFAULT_APP_OPTIONS: App.AppOptions = {
  currency: {
    code: CurrencyCode.RUB,
    exchangeRate: 1,
  },
  nextSchoolYearProductsExists: false,
  phoneConfirmationType: 'sms',
  prerender: false,
  showOlympiadBanner: false,
  user: FoxfordService.user.createUser({} as UserData),
}

declare global {
  interface Window {
    initial_state: {
      [SERVICE_NAME]: App.AppOptions
    }
  }
}

const $appOptions: Store<App.AppOptions> = domain.createStore(DEFAULT_APP_OPTIONS, {
  sid: SERVICE_NAME,
})

$appOptions.on(updateAppOptions, (_, payload) => payload).on(getAppOptionsFx.doneData, (_, data) => data)

export { $appOptions }
