import { Store } from 'effector'
import { CurrencyCode } from 'namespaces/enums'
import { BaseService } from '../base'
import { data } from './model/store'

type StoreService = Store<{
  currencyCode: CurrencyCode
  currencyExchangeRate: number
}>

const CURRENCY_CODES = {
  KZT: '\u20B8',
  RUB: '\u20BD',
}

class CurrencyService extends BaseService<StoreService> {
  exchangeValue = (value: number, round?: number): number => {
    const { currencyExchangeRate } = this.getState()

    const val = value / currencyExchangeRate

    return typeof round === 'number' && round >= 0 ? this.roundTo(val) : val
  }

  getIsoCurrencyCode = (): string => {
    const { currencyCode } = this.getState()

    return CURRENCY_CODES[currencyCode] || ''
  }

  roundTo = (value: number, round = 10): number => {
    return Math.round(value / round) * round
  }
}

const currencyService = new CurrencyService(data)

export { currencyService as CurrencyService }
