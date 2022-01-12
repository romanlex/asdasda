import { Logger } from 'services/logger'

export const TRACK_ANALYTICS_DATA = 'analytics/TRACK_ANALYTICS_DATA'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Array<any>
  }
}

/**
 * Трэкинг действий пользователя для аналитики
 *
 * @param {string} trigger триггер аналитики
 * @param {App.AnalyticContext} context контекс аналитики
 * @param {App.AnalyticPayload} payload объект пэйлоада для перегрузки вместо context.payload. Используется при необходимости отослать иные данные
 */
export const trackAnalytics = (
  trigger: string,
  context: App.AnalyticContext = { prefix: 'app', module: 'main' },
  payload: App.AnalyticPayload = null
): boolean => {
  if (!trigger || typeof trigger !== 'string') {
    Logger.warn('Attention!!! Check your call of trackAnalytics function. Trigger is invalid.')

    return false
  }

  const data = payload || {}
  const dataTrigger = [context.prefix, context.module, trigger].filter((part) => !!part).join('.')

  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable */
    let payloadString = ''
    let payloadStyles = ''

    if (Object.keys(data).length > 0) {
      payloadString = `%c\n\r${JSON.stringify(data, null, 2)}`
      payloadStyles = 'background: linear-gradient(to top, #4b79a1, #283e51); font-size: 10px; color: #ffffff;'
    }

    console.debug(
      `%c📊Track analytic action: ` + `%c${dataTrigger}` + payloadString,
      'background: linear-gradient(to top, #4b79a1, #283e51); padding: 8px 0px 8px 8px; font-size: 12px; color: #ffffff;',
      'background: linear-gradient(to top, #4b79a1, #283e51); padding: 8px 8px 8px 0px; font-size: 12px; color: #ffffff; font-weight: bold;',
      payloadStyles
    )
    /* eslint-enable */
  }

  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({
    event: null,
    payload: null,
  })

  window.dataLayer.push({
    event: TRACK_ANALYTICS_DATA,
    payload: {
      properties: data,
      trigger: dataTrigger,
    },
  })

  return true
}
