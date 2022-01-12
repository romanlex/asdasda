import { memo, useEffect } from 'react'
import { AppOptionsService } from 'services/app-options'
import { FoxfordService } from 'services/foxford'

type SplitComponentProps = {
  children?: JSX.Element | ((_args: boolean) => JSX.Element) | null
  debug?: boolean
  experimentId: App.Experiment['name']
  showOn: App.Experiment['value']
}

const SplitComponent = ({ experimentId, showOn, children = null }: SplitComponentProps) => {
  const variation = AppOptionsService._getExperimentValue(experimentId)
  const matched = variation === showOn

  useEffect(() => {
    if (matched) FoxfordService.pushExperiment(experimentId, showOn)
  }, [matched, experimentId, showOn])

  if (typeof children === 'function') {
    return children(matched)
  }

  if (matched) return children

  return null
}

const SplitComponentMemo = memo<SplitComponentProps>(SplitComponent)

export { SplitComponentMemo as SplitComponent }
