import { combine, Store } from 'effector'
import { CurrencyCode } from 'namespaces/enums'
import { AppOptionsService } from 'services/app-options'
import { DEFAULT_EXCHANGE_RATE, DEFAULT_CURRENCY } from '../data'

const $appOptions = AppOptionsService.getStore()

const $currency: Store<App.Currency> = $appOptions.map((data) => data.currency)
const currencyCode: Store<CurrencyCode> = $currency.map((data) => data.code || DEFAULT_CURRENCY)
const currencyExchangeRate: Store<number> = $currency.map((data) => data.exchangeRate || DEFAULT_EXCHANGE_RATE)

const data = combine({
  currencyCode,
  currencyExchangeRate,
})

export { data }
