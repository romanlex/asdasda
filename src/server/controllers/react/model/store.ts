import { restore } from 'effector'
import { requestMetaReceived } from './events'

export const requestMeta = restore(requestMetaReceived, {
  baseUrl: '',
  cookie: '',
  cookies: {},
})
