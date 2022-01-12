import { useEvent, useStore } from 'effector-react/scope'
import styled from 'styled-components'
import { AppOptionsService } from 'services/app-options'
import { ABSplitList } from 'features/ab-list'
import { ThemeDebugPanel } from 'features/theme-toggler'
import { UserService } from 'services/user'
import { Media } from 'shared/ui/molecules/media'
import { useFormatMessage } from 'services/i18n/react/hooks'
import { LocaleSwitcher } from 'features/locale-switcher'
import * as model from './model'

const Button = styled.button`
  background-color: transparent;
  border: 1px solid lightblue;
  padding: 1rem;
  border-radius: 1rem;
`

const $appOptions = AppOptionsService.getStore()
const $user = UserService.getStore()

export const HomePage: React.FC = () => {
  const increment = useEvent(model.incrementClicked)
  const reset = useEvent(model.resetClicked)

  const counterValue = useStore(model.$counterValue)
  const pagePending = useStore(model.$pagePending)
  const appOptions = useStore($appOptions)
  const user = useStore($user)
  const t = useFormatMessage()

  return (
    <section>
      <h2>
        {t({
          id: 'app.home.title',
        })}
      </h2>
      <div>
        <h4>
          {t({
            id: 'app.home.counter',
          })}
          : {counterValue}
        </h4>
        <Button disabled={pagePending} onClick={increment}>
          Increment
        </Button>
        <Button disabled={pagePending} onClick={reset}>
          Reset
        </Button>
      </div>
      <LocaleSwitcher />
      <br />
      <h1>
        {t({
          id: 'app.home.themes',
        })}
      </h1>
      <ThemeDebugPanel />
      <br />
      <br />
      <h1>
        {t({
          id: 'app.home.app.options',
        })}
      </h1>
      <div style={{ width: 500 }}>
        {t({
          id: 'app.home.app.options.value',
        })}
        : <pre>{JSON.stringify(appOptions, null, 2)}</pre>
      </div>
      <br />
      <h1>User</h1>
      <div>Is logged in: {user.isLoggedIn().toString()}</div>
      <div style={{ width: 500 }}>
        Your app options: <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      <br />
      <h1>AB Experiments</h1>
      <ABSplitList />
      <Media desktop>
        <div>asdasd</div>
      </Media>
    </section>
  )
}
