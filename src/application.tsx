import { StrictMode } from 'react'
import { Normalize } from 'styled-normalize'
import { createGlobalStyle } from 'styled-components'
import { Scope } from 'effector'
import { Provider } from 'effector-react/scope'
import { Helmet } from 'react-helmet-async'
import { themes } from 'shared/ui/themes'
import { ThemeProvider } from 'features/theme-toggler'
import { I18nService } from 'services/i18n'
import { getAppPages } from './pages'
import 'services/app-options'
import 'services/currency'
import 'services/foxford'

interface Props {
  root: Scope
}

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`

const Body = () => (
  <>
    <Helmet htmlAttributes={{ lang: 'en' }} titleTemplate='%s | Foxford' defaultTitle='Foxford'>
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Helmet>
    <Normalize />
    <GlobalStyles />

    <div>
      <div>Heading of the app</div>
      {getAppPages()}
    </div>
  </>
)

export const Application: React.FC<Props> = ({ root }) => (
  <StrictMode>
    <Provider value={root}>
      <I18nService.Provider>
        <ThemeProvider themes={themes}>
          <Body />
        </ThemeProvider>
      </I18nService.Provider>
    </Provider>
  </StrictMode>
)
