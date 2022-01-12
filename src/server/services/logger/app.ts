import { injectable } from 'inversify'
import winston from 'winston'
import { DateTime } from 'luxon'
import 'winston-daily-rotate-file'
import { config } from 'server/config'
import { Logger } from './interface'
import { accessLogger } from './middlewares/morgan'

const { printf } = winston.format

const messageFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] [${DateTime.fromISO(timestamp).toFormat('dd.mm.yyyy-HH:MM:ss')}]: ${message}`
})

@injectable()
export class AppLogger implements Logger {
  private _logger

  constructor() {
    this._logger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: config.LOGGER.APP_LOG_PATH,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: config.LOGGER.APP_MAX_SIZE,
          maxFiles: config.LOGGER.APP_MAX_SIZE,
          level: 'info',
          handleExceptions: true,
        }),
        new winston.transports.DailyRotateFile({
          filename: config.LOGGER.APP_ERROR_LOG_PATH,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: config.LOGGER.APP_MAX_SIZE,
          maxFiles: config.LOGGER.APP_MAX_SIZE,
          level: 'error',
          handleExceptions: true,
        }),
      ],
      format: winston.format.combine(
        winston.format((info) => {
          info.level = info.level.toUpperCase()
          return info
        })(),
        winston.format.timestamp(),
        winston.format.json(),
        // winston.format.colorize({ all: true }),
        messageFormat
      ),
      level: config.LOGGER.LEVEL,
      exitOnError: false,
    })

    if (process.env.NODE_ENV === 'development') {
      this._logger.add(
        new winston.transports.Console({
          handleExceptions: true,
          format: winston.format.combine(
            winston.format((info) => {
              info.level = info.level.toUpperCase()
              return info
            })(),
            winston.format.timestamp(),
            winston.format.json(),
            messageFormat
          ),
        })
      )
    }
  }

  accessLogger = accessLogger

  log(level: string, message: string, meta: any): void {
    this._logger.log(level, message, meta)
  }
  info(message: string, meta: any): void {
    this._logger.log('info', message, meta)
  }
  debug(message: string, meta: any): void {
    this._logger.log('debug', message, meta)
  }
  warn(message: string, meta: any): void {
    this._logger.log('warn', message, meta)
  }
  error(message: string, meta: any): void {
    this._logger.log('error', message, meta)
  }
  verbose(message: string, meta: any): void {
    this._logger.log('verbose', message, meta)
  }
}
