import { Domain } from 'effector'
import { appDomain } from 'shared/libs/effector/factories/hatch'
import { SERVICE_NAME } from '../constants'
import { logger } from '../logger'

export const domain: Domain = appDomain.createDomain(SERVICE_NAME)

domain.onCreateEffect((effect) => {
  effect.fail.watch((error) => {
    logger.error(error)
  })
})
