import * as Sentry from '@sentry/browser'
import { ILogHandler } from 'js-logger'
import { pick } from 'ramda'
import { logger } from './logger'

const { SENTRY = 'false', SENTRY_DSN, RELEASE, SENTRY_ENVIRONMENT, NODE_ENV } = process.env

class SentryService {
  sentry: typeof Sentry

  static includedSources = [/\/assets\/webpack\//i]

  static USER_FIELDS_WHITE_LIST = [
    'id',
    'grade',
    'hasActivePurchases',
    'isAgent',
    'isCoach',
    'isCustomer',
    'isGraduated',
    'isParent',
    'emailConfirmed',
    'fakeUser',
  ]

  constructor() {
    this.sentry = Sentry

    if (SENTRY === 'true') {
      this.initilize()
    }
  }

  initilize = () => {
    logger.debug('Initialize sentry')

    if (!SENTRY_DSN) throw new Error('SENTRY_DSN is undefined')
    if (!RELEASE) throw new Error('RELEASE is undefined')

    const config: Sentry.BrowserOptions = {
      beforeSend: this.beforeSendProcess,
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT || NODE_ENV || 'production',
      release: RELEASE,
      sampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.4 : 1,
    }

    logger.debug('Init sentry service with: ', config)

    this.sentry.init(config)
  }

  beforeSendProcess = (event: Sentry.Event) => {
    return event
  }

  sanitizeUserData = (user: { id: number }) => {
    return pick(SentryService.USER_FIELDS_WHITE_LIST, user)
  }

  loggerHandler: ILogHandler = (error, errorInfo) => {
    this.sentry.withScope((scope) => {
      // TODO: get user
      const { user, ...context } = { user: { id: 0 }, featureFlags: [] }

      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })

      scope.setUser({
        id: `${user.id}`,
      })

      scope.setExtra('user', this.sanitizeUserData(user))
      scope.setExtra('featureFlags', context.featureFlags || [])

      this.sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
        extra: { errorInfo },
      })
    })
  }
}

const sentry = new SentryService()

export { sentry as Sentry }
