// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sentryHandler: (_messages: Array<any>, _context: any) => void = () => undefined

if (process.env.SENTRY === 'true') {
  import(/* webpackMode: "eager" */ 'services/sentry')
    .then(({ Sentry }) => {
      // eslint-disable-next-line no-console
      console.debug('Bind sentry service to logger')

      sentryHandler = (messages, context) => {
        const { level = { name: 'INFO' } } = context

        if (level.name === 'ERROR') {
          Sentry.loggerHandler(messages[0], { ...context, args: messages[1] || null })
        }
      }

      return true
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.error(error))
}

export { sentryHandler }
