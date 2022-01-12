import { forward } from 'effector'
import { Logger } from 'server/services/logger'
import { splitMap } from 'shared/libs/effector/split-map'
import { getHatch, HatchParams } from 'shared/libs/effector/factories/hatch'
import { commonHatch } from 'services/base'
import { ROUTES } from '../../routes/routes'
import { routeNotResolved, routeResolved } from '../controllers/react/model/events'
import { ioc, TYPES } from '../ioc'

const logger = ioc.get<Logger>(TYPES.Logger)

for (const { component, path, exact } of ROUTES) {
  if (!component) {
    logger.debug(`No component for path "${path}"`, { component, path, exact })
    continue
  }

  const hatch = getHatch(component)

  if (!hatch) {
    logger.debug(`No hatch for path "${path}"`, { component, path, exact })
    continue
  }

  const { routeMatched, __: notMatched } = splitMap({
    source: routeResolved,
    cases: {
      routeMatched({ route, match, req }) {
        if (route.path === path)
          return {
            params: match.params,
            query: req.query,
          } as HatchParams

        return undefined
      },
    },
  })

  routeNotResolved.watch(({ req }) => {
    logger.debug(`Not found route for this path ${req.url}`, { url: req.url, query: req.query })
  })

  routeMatched.watch((match) => {
    logger.debug(`Route matched for "${path}"`, match)
  })

  notMatched.watch(({ req, res }) => {
    logger.debug(`Route not matched for "${req.url}"`)
    res.writeHead(404)
  })

  forward({
    from: routeMatched,
    to: hatch.enter,
  })

  forward({ from: routeMatched, to: commonHatch.enter })
}
