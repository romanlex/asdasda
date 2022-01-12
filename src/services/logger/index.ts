import Logger from 'js-logger'
import { sentryHandler } from './sentry-handler'

export function initLogger(): boolean {
  // eslint-disable-next-line no-console
  console.debug('Init logger')
  Logger.useDefaults()
  const consoleHandler = Logger.createDefaultHandler()

  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_BETA !== 'true') {
    Logger.setLevel(Logger.INFO)
  } else {
    Logger.setLevel(Logger.DEBUG)
  }

  Logger.setHandler((messages, context) => {
    consoleHandler(messages, context)
    sentryHandler(messages, context)
  })

  return true
}

export { Logger }

export default Logger
