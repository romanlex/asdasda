import { forward, Store } from 'effector'
import { BaseService } from '../base'
import { $appOptions } from './model/store'
import { getAppOptions, updateAppOptions } from './model/events'

type StoreService = Store<App.AppOptions>

class AppOptionsService<T extends StoreService> extends BaseService<StoreService> {
  getAppOptions = getAppOptions

  constructor(store: T) {
    super(store)

    forward({ from: this.serviceHatch.enter, to: this.getAppOptions })
  }

  onUpdateAppOptions: (_event: CustomEvent) => void = (event: CustomEvent) => {
    if (event.detail) updateAppOptions(event.detail as App.AppOptions)
  }

  /**
   * Returns a value of an AB-test experiment selected by it's id
   */
  _getExperimentValue(experimentId: string): string | null {
    if (!this.state) throw new Error('state with appOptions is undefined')

    const { experiments = [] } = this.state
    const experiment = experiments.find(({ name }) => name === experimentId)

    return experiment?.value || null
  }

  /**
   * Checks exstence of the feature flag
   * @param {string} flag
   */
  checkFeaureFlagExistence: (_flag: App.FeatureFlagName) => boolean = (flag: App.FeatureFlagName): boolean => {
    if (!this.state) throw new Error('state with appOptions is undefined')

    const { featureFlags = [] } = this.state
    const hasFlag = featureFlags.includes(flag)

    return hasFlag
  }
}

const aService = new AppOptionsService($appOptions)

export { aService as AppOptionsService }
