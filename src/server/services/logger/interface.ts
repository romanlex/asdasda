/* eslint-disable no-unused-vars */
import http from 'http'

type Handler<Request extends http.IncomingMessage, Response extends http.ServerResponse> = (
  req: Request,
  res: Response,
  callback: (err?: Error) => void
) => void

export interface Logger {
  accessLogger: Handler<http.IncomingMessage, http.ServerResponse>

  log: (level: string, message: string, meta?: any) => void
  info(message: string, meta?: any): void
  debug(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string, meta?: any): void
  verbose(message: string, meta?: any): void
  /* eslint-enable no-unused-vars */
}
