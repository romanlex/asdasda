import { withHatch } from 'shared/libs/effector/factories/hatch'

import * as model from './model'
import * as page from './page'

export const HomePage = withHatch(model.hatch, page.HomePage)
