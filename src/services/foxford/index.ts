// @flow
import { Foxford } from '@foxford/foxford-js-sdk'
import cookies from 'js-cookie'
import { Storage } from 'shared/libs/storage'
import { trackAnalytics } from 'shared/libs/analytics'
import { BackgroundWorker } from 'shared/libs/tasks/background-worker'
import { logger } from './logger'

interface FoxfordInterface {
  cart: Foxford['cart']
  course: Foxford['course']
  getInstance: () => Foxford
  leadrequest: Foxford['leadrequest']
  productPack: Foxford['productPack']
  promo: Foxford['promo']
  pushExperiment: (_experimendId: App.Experiment['name'], _experimentValue: App.Experiment['value']) => void
  tag: Foxford['tag']
  user: Foxford['user']
}

class FoxfordService implements FoxfordInterface {
  foxford: Foxford

  user: Foxford['user']

  promo: Foxford['promo']

  leadrequest: Foxford['leadrequest']

  course: Foxford['course']

  productPack: Foxford['productPack']

  tag: Foxford['tag']

  cart: Foxford['cart']

  experimentsWorker: BackgroundWorker<App.Experiment>

  constructor() {
    this.foxford = new Foxford({
      host: process.env.BUILD_TARGET === 'client' ? window.location.origin : 'localhost',
    })

    this.user = this.foxford.user
    this.promo = this.foxford.promo
    this.leadrequest = this.foxford.leadrequest
    this.course = this.foxford.course
    this.productPack = this.foxford.productPack
    this.tag = this.foxford.tag
    this.cart = this.foxford.cart

    this.experimentsWorker = new BackgroundWorker<App.Experiment>()
    if (process.env.NODE_ENV !== 'test') this.experimentsWorker.run(this._experimentHandler)
  }

  getInstance = (): Foxford => {
    return this.foxford
  }

  pushExperiment = (name: App.Experiment['name'], value: App.Experiment['value']) => {
    const exp: App.Experiment = { name, value }

    this.experimentsWorker.add(exp)
  }

  _experimentHandler = async (experiment: App.Experiment) => {
    const uid = cookies.get('uid') || null
    let experiments = {}

    if (typeof uid !== 'string') throw new TypeError('Uid is empty')

    try {
      experiments = Storage.getJson('seenExperiments') || {}
      const uidExperiments = experiments[`${uid}`] || []

      if (uidExperiments.includes(experiment.name)) return

      await this.user.pushEvent({ action: 'experiment', label: experiment.name })
      Storage.setJson('seenExperiments', { ...experiments, [uid]: [...uidExperiments, experiment.name] })

      trackAnalytics('show', { module: 'experiment', prefix: 'app' }, { experiment })
    } catch (error) {
      Storage.setJson('seenExperiments', {
        ...experiments,
        [`${uid}`]: experiments[`${uid}`].filter((item: App.Experiment['name']) => item !== experiment.name),
      })
      logger.error("Couldn't push user event with experiment id", { error, uid })
    }
  }
}

const fxfService: FoxfordService = new FoxfordService()

export { fxfService as FoxfordService }
