/* eslint-disable no-console */
import http from 'http'
import chalk from 'chalk'
import { ioc, TYPES } from 'server/ioc'
import { Logger } from 'server/services/logger'

interface HandleExitOptions {
  cleanup?: boolean
  exit?: boolean
}

const logger = ioc.get<Logger>(TYPES.Logger)

const HOST = process.env.SERVER_HOSTNAME || '0.0.0.0'
const PORT = Number.parseInt(process.env.SERVER_PORT ?? '3000', 10)

// this require is necessary for server HMR to recover from error
let app = require('./server').server

const server = http.createServer(app)

let currentApp = app

server.listen(PORT, HOST, (error?: Error) => {
  if (error) {
    console.error(error)
  }

  const address = server.address()
  if (address && typeof address !== 'string')
    console.info(
      chalk.green.bold(`
    ------------------------------------------------
    🚀 App is started on http://${address.address}:${PORT} 🚀
    ------------------------------------------------`)
    )
})

if (module.hot) {
  module.hot.accept('./server', () => {
    console.info('🔁  HMR Reloading `./server`...')
    try {
      app = require('./server').server
      server.removeListener('request', currentApp)
      server.on('request', app)
      currentApp = app
    } catch (error) {
      console.error(error)
    }
  })
  console.info('✅  Server-side HMR Enabled!')
}

// Shutdown Node.js app gracefully

function handleExit(options: HandleExitOptions, err: any): void {
  if (options.cleanup) {
    const actions = [server.close]

    actions.forEach((close, i) => {
      try {
        close(() => {
          if (i === actions.length - 1) process.exit()
        })
      } catch (error) {
        if (i === actions.length - 1) process.exit()
      }
    })
  }

  if (err) {
    logger.error(err.toString())
    logger.error(err.stack || '')
  }
  if (options.exit) process.exit()
}

process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true }))
process.on('SIGTERM', handleExit.bind(null, { exit: true }))
process.on('uncaughtException', handleExit.bind(null, { exit: true }))
