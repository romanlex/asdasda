import { createDomain, Store } from 'effector'
import { createHatch, Hatch } from 'shared/libs/effector/factories/hatch'

export const commonHatch = createHatch(createDomain('service-hatch-provider'))

export class BaseService<T extends Store<ReturnType<T['getState']>>> {
  store: T
  state: ReturnType<T['getState']>
  serviceHatch: Hatch

  constructor(store: T) {
    this.store = store
    this.serviceHatch = commonHatch
    this.state = store.getState()
    store.watch((state) => {
      this.state = state
    })
  }

  bindListeners: () => void = () => {
    throw new Error('You must specify bindListeners method in your class')
  }

  getStore(): T {
    return this.store
  }

  /**
   * Returns the current state of the store
   */
  getState(): ReturnType<T['getState']> {
    return this.state
  }
}
