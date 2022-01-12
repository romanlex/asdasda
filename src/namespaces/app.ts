namespace App {
  export interface Experiment {
    name: string
    value: string
  }

  export type FeatureFlagName = string

  export type FeedbackTheme = {
    id: number
    name: string
    type: string
  }

  export interface AppOptions {
    currency: App.Currency
    experiments?: Array<Experiment>
    featureFlags?: Array<FeatureFlagName>
    menuState?: boolean
    nextSchoolYearProductsExists: boolean
    phoneConfirmationType: 'sms' | 'phone_call'
    prerender?: boolean
    requestMetaTags?: boolean
    showOlympiadBanner: boolean
    flashAlert?: string
    flashWarning?: string
    flashNotice?: string
    vkAppid?: string
    yandexAppId?: string
    feedbackThemes?: {
      [key: string]: FeedbackTheme
    }
    user?: Partial<import('@foxford/foxford-js-sdk').UserData>
  }

  export interface AnalyticContext {
    module: string
    prefix: string
  }

  export type AnalyticPayload = any

  export type Breakpoints = {
    [key: string]: number
  }

  export type ColorAlias = string
  export type Color = {
    r: number
    g: number
    b: number
    hex: string
  }

  export type Colors = { [key: ColorAlias]: Color }

  export type Theme = { breakpoints: Breakpoints; colors: Colors }

  export type ThemeAlias = import('./enums').AppTheme

  export type Locale = import('./enums').AppLocale
}
