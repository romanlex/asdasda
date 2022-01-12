import { ServerStyleSheet } from 'styled-components'
import { StaticRouter } from 'react-router-dom'
import { Scope } from 'effector'
import express from 'express'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { Application } from '../../../application'

export const collectStylesWithJsx = (
  sheet: ServerStyleSheet,
  helmetContext: FilledContext,
  req: express.Request,
  scope: Scope,
  extractor: ChunkExtractor
) =>
  sheet.collectStyles(
    <ChunkExtractorManager extractor={extractor}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter context={{}} location={req.url}>
          <Application root={scope} />
        </StaticRouter>
      </HelmetProvider>
    </ChunkExtractorManager>
  )
