import { ErrorRequestHandler } from 'express'
import PrettyError from 'pretty-error'
import { Logger } from 'server/services/logger'
import { ioc, TYPES } from '../ioc'

const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

const logger = ioc.get<Logger>(TYPES.Logger)

export const errorRequestHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
  logger.error(err.toString())
  logger.error(err.stack || '')
  process.stderr.write(pe.render(err))
  res.status(500)
  res.send('Something wrong!')
  next()
}
