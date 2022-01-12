namespace App {
  export interface Currency {
    code: import('./enums').CurrencyCode
    exchangeRate: number
  }
}
