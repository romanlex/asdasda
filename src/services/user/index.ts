import { User } from '@foxford/foxford-js-sdk'
import { Store } from 'effector'
import { BaseService } from '../base'
import { $user } from './model/store'

class UserService extends BaseService<Store<User>> {}

const uService = new UserService($user)

export { uService as UserService }
