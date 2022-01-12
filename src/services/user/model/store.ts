import { UserData } from '@foxford/foxford-js-sdk'
import { AppOptionsService } from 'services/app-options'
import { FoxfordService } from 'services/foxford'

const $appOptions = AppOptionsService.getStore()
const $user = $appOptions.map((appOptions) => {
  return FoxfordService.user.createUser(appOptions?.user as UserData)
})

export { $user }
