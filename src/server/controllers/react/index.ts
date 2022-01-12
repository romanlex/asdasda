import path from 'path'
import * as ReactDOMServer from 'react-dom/server'
import { fork, serialize, allSettled } from 'effector'
import express from 'express'
import { ServerStyleSheet } from 'styled-components'
import { FilledContext } from 'react-helmet-async'
import through from 'through'
import { ChunkExtractor } from '@loadable/server'
import { Logger } from 'server/services/logger'
import { ioc, TYPES } from 'server/ioc'
import { measurement } from 'shared/libs/measure'
import { DEFAULT_LANG } from 'services/i18n/constants'
import { assets } from '../../assets'
import { serverStarted } from './model/events'
import { collectStylesWithJsx } from './collectStyles'
import { requestMeta } from './model/store'

const logger = ioc.get<Logger>(TYPES.Logger)

declare module 'express-session' {
  interface SessionData {
    meta: { theme: App.ThemeAlias; locale: App.Locale; timezone: string }
  }
}

export default async (req: express.Request, res: express.Response) => {
  const pageContructionTime = measurement('page construction', logger.verbose.bind(logger))
  const allSettledTime = measurement('all settled', logger.verbose.bind(logger))

  const scope = fork()

  req.session.userAgent = req.headers['user-agent']
  req.session.meta = {
    theme: req.cookies['theme'] || 'auto',
    locale: req.cookies['locale'] || DEFAULT_LANG,
    timezone: req.cookies['tz'],
  }

  try {
    await allSettled(serverStarted, {
      scope,
      params: { req, res },
    })
  } catch (error) {
    if (typeof error === 'string') {
      logger.error(error)
    } else if (error instanceof Error) {
      logger.error(error.message)
    }
  }

  allSettledTime.measure()

  const serializeTime = measurement('serialize scope', logger.verbose.bind(logger))

  const storesValues = serialize(scope, {
    ignore: [requestMeta],
  })
  serializeTime.measure()

  const sheet = new ServerStyleSheet()
  const helmetContext: FilledContext = {} as FilledContext

  const collectStylesTime = measurement('sheet collects styles', logger.verbose.bind(logger))

  const chunkExtractor = new ChunkExtractor({
    statsFile: path.resolve('build/loadable-stats.json'),
    entrypoints: ['client'],
  })

  const jsx = collectStylesWithJsx(sheet, helmetContext, req, scope, chunkExtractor)

  collectStylesTime.measure()

  let sent = false

  const renderTime = measurement('react dom server render to stream', logger.verbose.bind(logger))
  const stream = sheet.interleaveWithNodeStream(ReactDOMServer.renderToNodeStream(jsx))

  stream
    .pipe(
      through(
        function write(data) {
          if (!sent) {
            this.queue(
              htmlStart({
                helmet: helmetContext.helmet,
                assetsCss: assets.client.css,
                assetsJs: assets.client.js,
                chunkExtractor,
                theme: req.session.meta?.theme as App.ThemeAlias,
                locale: req.session.meta?.locale as App.Locale,
              })
            )
            sent = true
          }
          this.queue(data)
        },
        function end() {
          this.queue(htmlEnd({ storesValues, helmet: helmetContext.helmet, chunkExtractor }))
          this.queue(null)
          renderTime.measure()
          pageContructionTime.measure()
        }
      )
    )
    .pipe(res)

  cleanUp()

  stream.on('error', (error) => {
    if (typeof error === 'string') {
      logger.error(error)
    } else if (error instanceof Error) {
      logger.error(error.message)
    }
    res.status(500).end()
  })

  function cleanUp() {
    sheet.seal()
  }
}

interface StartProps {
  assetsCss?: string
  assetsJs: string
  helmet: FilledContext['helmet']
  chunkExtractor: ChunkExtractor
  theme?: App.ThemeAlias
  locale?: App.Locale
}

interface EndProps {
  storesValues: Record<string, unknown>
  helmet: FilledContext['helmet']
  chunkExtractor: ChunkExtractor
}

function htmlStart(props: StartProps) {
  return `<!DOCTYPE html>
  <html lang="${props.locale}">
    <head>
      ${props.helmet?.base.toString()}
      ${props.helmet?.meta.toString()}
      ${props.helmet?.title.toString()}
      ${props.helmet?.link.toString()}
      ${props.helmet?.style.toString()}
      ${props.assetsCss ? `<link rel='stylesheet' href='${props.assetsCss}'>` : ''}
      ${props.chunkExtractor.getStyleTags()}
      ${props.chunkExtractor.getLinkTags()}
    </head>
    <body ${props.helmet?.bodyAttributes.toString()} data-theme="${props.theme}">
      <div id='root'>`
}

function htmlEnd(props: EndProps) {
  return `</div>
    <script>
      window['initial_state'] = ${JSON.stringify(props.storesValues)}
    </script>
    ${props.helmet?.script.toString()}
    ${props.helmet?.noscript.toString()}
    ${props.chunkExtractor.getScriptTags()}
  </body>
</html>
  `
}
