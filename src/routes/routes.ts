import { RouteConfig } from 'react-router-config'
import { Error404Page } from 'pages/error404'
import { HomePage } from 'pages/home'
import { LegalPage } from 'pages/legal'
import ROUTES_MAP from './routes-map'

export const ROUTES: RouteConfig[] = [
  {
    path: ROUTES_MAP.HOME,
    exact: true,
    component: HomePage,
  },
  {
    path: ROUTES_MAP.LEGAL_PAGES,
    exact: true,
    component: LegalPage,
  },
  {
    path: '*',
    component: Error404Page,
    status: 404,
  },
]
