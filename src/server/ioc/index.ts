import 'reflect-metadata'
import { Container } from 'inversify'
import { Logger, AppLogger } from 'server/services/logger'
import { TYPES } from './types'

const ioc = new Container()

ioc.bind(TYPES.Config)
ioc.bind<Logger>(TYPES.Logger).to(AppLogger)

export { ioc }
export * from './types'
