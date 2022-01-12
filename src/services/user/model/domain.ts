import { Domain } from 'effector'
import { appDomain } from 'shared/libs/effector/factories/hatch'
import { SERVICE_NAME } from '../constants'

export const domain: Domain = appDomain.createDomain(SERVICE_NAME)
