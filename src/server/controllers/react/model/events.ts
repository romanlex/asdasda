import express from 'express'
import { createEvent } from 'effector'
import { matchRoutes } from 'react-router-config'
import { splitMap } from 'shared/libs/effector/split-map'
import { ROUTES } from '../../../../routes/routes'

export const serverStarted = createEvent<{
  req: express.Request
  res: express.Response
}>()

export const requestHandled = serverStarted.map(({ req, res }) => ({ req, res }))

export const requestMetaReceived = requestHandled.filterMap(({ req }) => ({
  cookies: req.cookies,
  cookie: req.headers.cookie,
  baseUrl: `http${req.secure ? 's' : ''}://${req.headers.host}`,
}))

export const { routeResolved, __: routeNotResolved } = splitMap({
  source: requestHandled,
  cases: {
    routeResolved: ({ req, res }) => {
      const routes = matchRoutes(ROUTES, req.url.split('?')[0])

      if (routes.length > 0) {
        const route = routes[0]

        return {
          route: route.route,
          match: route.match,
          req,
          res,
        }
      }

      return undefined
    },
  },
})
