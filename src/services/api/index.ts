import fetch from 'cross-fetch'
import { requestMeta } from 'server/controllers/react/model/store'

interface FetchConfig {
  sendInternalCookies?: boolean
  meta?: {
    cookie: string | undefined
    baseUrl: string
  }
}

function fetchWithParams(f: typeof fetch) {
  return ({ sendInternalCookies }: FetchConfig) => {
    // eslint-disable-next-line no-undef
    return (url: string, otherParams?: RequestInit) => {
      const meta = requestMeta.getState()
      return f((meta?.baseUrl || '') + url, {
        headers: {
          'Content-Type': 'application/json',
          ...(sendInternalCookies ? { Cookie: meta?.cookie || '' } : {}),
        },
        ...otherParams,
      })
    }
  }
}

const fetchApi = fetchWithParams(fetch)({
  sendInternalCookies: process.env.BUILD_TARGET === 'server',
  meta: requestMeta.getState(),
})

export { fetchApi as api }
