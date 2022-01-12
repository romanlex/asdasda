import { renderRoutes } from 'react-router-config'
import { ROUTES } from '../routes/routes'

export const getAppPages = () => renderRoutes(ROUTES)
