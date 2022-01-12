import path from 'path'
import morgan from 'morgan'
import * as rfs from 'rotating-file-stream'
import { DateTime } from 'luxon'
import { config } from 'server/config'

const accessLogStream = rfs.createStream(
  () => {
    return path.basename(config.LOGGER.ACCESS_LOG_PATH).replace('%DATE%', DateTime.local().toFormat('yyyy-MM-dd'))
  },
  {
    interval: config.LOGGER.ACCESS_LOG_INTERVAL,
    path: path.dirname(config.LOGGER.ACCESS_LOG_PATH),
  }
)

const accessLogger = morgan('combined', { stream: accessLogStream })

export { accessLogger }
