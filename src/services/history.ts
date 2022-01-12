import { Scope, scopeBind } from 'effector'
import { createBrowserHistory } from 'history'
import { appDomain } from 'shared/libs/effector/factories/hatch'

export interface HistoryChange {
  pathname: string
  hash: string
  search: string
  action: 'PUSH' | 'POP' | 'REPLACE'
}

export const history = process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null

export const $redirectTo = appDomain.createStore('')

export const historyChanged = appDomain.createEvent<HistoryChange>()

export function initializeClientHistory(scope: Scope) {
  const boundHistoryChange = scopeBind(historyChanged, { scope })
  history?.listen(({ pathname, search, hash }, action) => {
    boundHistoryChange({ pathname, search, hash, action })
  })
  boundHistoryChange({ pathname: location.pathname, search: location.search, hash: location.hash, action: 'POP' })
}
