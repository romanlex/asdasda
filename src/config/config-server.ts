// eslint-disable-next-line import/no-unresolved
import { Config } from 'config/config-APP_TARGET'
import { config as serverConfig } from 'server/config'

const config: Config = {
  apiHost: serverConfig.API.TARGET,
}

export default config
