import path from 'path'

export const config = {
  LOGGER: {
    APP_LOG_PATH: path.join(__dirname, 'tmp/log/app-%DATE%.log'),
    APP_ERROR_LOG_PATH: path.join(__dirname, 'tmp/log/error-%DATE%.log'),
    APP_MAX_SIZE: '10m',
    APP_MAX_FILES: '14d',
    ACCESS_LOG_PATH: path.join(__dirname, 'tmp/log/access-%DATE%.log'),
    ACCESS_LOG_INTERVAL: '1d', // rotate daily
    LEVEL: process.env.LOG_LEVEL || 'silly',
  },
  API: {
    TARGET: 'http://0.0.0.0:2999',
  },
}
