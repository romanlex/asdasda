import './bootstrap/init'
import path from 'path'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import session from 'express-session'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

declare module 'express-session' {
  export interface SessionData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: { [key: string]: any }
    userAgent: string
  }
}

import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import SessionFileStore from 'session-file-store'
import { camelcaseKeysDeep } from 'shared/libs/string/camelize'
import removeHeaders from './middlewares/remove-headers'
import { errorRequestHandler } from './middlewares/error-handler'
import ReactController from './controllers/react'
import { ioc, TYPES } from './ioc'
import { Logger } from './services/logger'
import { config } from './config'

const PUBLIC_DIR = process.env.RAZZLE_PUBLIC_DIR || null

if (PUBLIC_DIR === null) throw new Error('PUBLIC_DIR is undefined')

const logger = ioc.get<Logger>(TYPES.Logger)

const app = express()

app.set('trust proxy', 1)
app.use(logger.accessLogger)

app.use(removeHeaders)
app.use(express.static(PUBLIC_DIR))
app.use(cookieParser())
app.use(cors())
app.use(compression())
const FileStore = SessionFileStore(session)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '1mb' }))
app.use(
  session({
    store: new FileStore({
      path: path.resolve(__dirname, 'tmp/cache/sessions'),
      ttl: 60,
      logFn: (message: string) => {
        logger.info(message)
      },
    }),
    secret: 'BV.TY%^ytuj',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60, secure: false },
    name: '_nmsid',
  })
)

const router: express.Router = require('express-promise-router')()

/**
 * Health Check endpoints
 */
router.get('/status', (req, res) => {
  res.status(200).end()
})

router.head('/status', (req, res) => {
  res.status(200).end()
})

router.all(
  '/internal/api/*',
  createProxyMiddleware({
    target: config.API.TARGET,
    changeOrigin: true,
    pathRewrite: { '^/internal/api': '/api' },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (buffer: Buffer) => {
      const result = buffer.toString('utf8')
      if (!result) return buffer

      try {
        const data = JSON.parse(result)
        const camelizeData = camelcaseKeysDeep(data)
        return JSON.stringify(camelizeData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.warn('Could not convert response: \n')
        logger.warn(err.stack ? err.stack.toString() : err.toString())
        return buffer
      }
    }),
  })
)
router.get('/*', ReactController)
app.use(router)

app.use(errorRequestHandler)

export { app as server }
