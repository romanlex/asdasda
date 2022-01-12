// import { createInspector } from 'effector-inspector';
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { allSettled, createEvent, createStore, fork, forward, guard, sample } from 'effector'
import { HelmetProvider } from 'react-helmet-async'
import { loadableReady } from '@loadable/component'
import { matchRoutes } from 'react-router-config'
import { ROUTES } from 'routes/routes'
import { getHatch, HatchParams } from 'shared/libs/effector/factories/hatch'
import { splitMap } from 'shared/libs/effector/split-map'
import { history, historyChanged, initializeClientHistory } from 'services/history'
import { commonHatch } from 'services/base'
import { Application } from './application'

const ready = createEvent()

const { routeResolved } = splitMap({
  source: historyChanged,
  cases: {
    routeResolved(change) {
      const routes = matchRoutes(ROUTES, change.pathname)

      if (routes.length > 0)
        return {
          route: routes[0].route,
          match: routes[0].match,
          change,
        }

      return undefined
    },
  },
})

function extractCurrentRoutePath() {
  const routes = matchRoutes(ROUTES, history?.location.pathname ?? '/')

  if (routes.length > 0) {
    return routes[0].route.path
  }
  return '/'
}

const $currentRoute = createStore(extractCurrentRoutePath())

for (const { component, path } of ROUTES) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hatch = getHatch(component as React.ComponentType<any>)
  const { routeMatched, __: routeNotMatched } = splitMap({
    source: routeResolved,
    cases: {
      routeMatched({ route, match, change }) {
        if (route.path === path)
          return {
            // route.path is a string with path params, like "/user/:userId"
            // :userId is a path param
            // match.params is an object contains parsed params values
            // "/user/123" will be transformed to { userId: 123 } in match.params
            params: match.params,
            query: Object.fromEntries(new URLSearchParams(change.search)),
          } as HatchParams

        return undefined
      },
    },
  })

  // TODO: add support for chunk loading

  const set = (name: string) => ({
    name: `(${path})${name}`,
    sid: `(${path})${name}`,
  })

  const hatchEnter = createEvent<HatchParams>(set('hatchEnter'))
  const hatchUpdate = createEvent<HatchParams>(set('hatchUpdate'))
  const hatchExit = createEvent<void>(set('hatchExit'))

  if (hatch) {
    forward({ from: hatchEnter, to: hatch.enter })
    forward({ from: hatchUpdate, to: hatch.update })
    forward({ from: hatchExit, to: hatch.exit })
    forward({ from: hatchEnter, to: commonHatch.enter })
    forward({ from: hatchUpdate, to: commonHatch.update })
    forward({ from: hatchExit, to: commonHatch.exit })
  }

  const $onCurrentPage = $currentRoute.map((route) => route === path)

  guard({
    source: $currentRoute,
    clock: routeNotMatched,
    filter: (currentRoute, { route: { path: newRoute } }) => {
      const pageRoute = path

      const isANewRouteDifferent = currentRoute !== newRoute
      const isCurrentRouteOfCurrentPage = currentRoute === pageRoute

      return isCurrentRouteOfCurrentPage && isANewRouteDifferent
    },
    target: hatchExit,
  })

  guard({
    clock: routeMatched,
    filter: $onCurrentPage,
    target: hatchUpdate,
  })

  const shouldEnter = guard({
    clock: routeMatched,
    filter: $onCurrentPage.map((on) => !on),
  })

  sample({ clock: shouldEnter, target: hatchEnter })

  sample({
    clock: shouldEnter,
    fn: () => path,
    target: $currentRoute,
  })
}

const scope = fork({ values: window.initial_state })

initializeClientHistory(scope)

forward({
  from: historyChanged,
  to: ready,
})

loadableReady().then(() => {
  allSettled(ready, { scope }).then(() => {
    ReactDOM.hydrate(
      <HelmetProvider>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Router history={history}>
          <Application root={scope} />
        </Router>
      </HelmetProvider>,
      document.querySelector('#root')
    )
  })
})

if (module.hot) {
  module.hot.accept()
}
