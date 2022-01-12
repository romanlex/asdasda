import { useStore } from 'effector-react/scope'
import { $experiments } from '../model'
import 'pages/home/model'

export const ABSplitList = () => {
  const experiments = useStore($experiments)

  return (
    <div style={{ width: 500 }}>
      Your experiments: <pre>{JSON.stringify(experiments, null, 2)}</pre>
    </div>
  )
}
