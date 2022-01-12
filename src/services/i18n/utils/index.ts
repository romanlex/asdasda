import { DEFAULT_LANG, SUPPORTED_LANGS } from '../constants'

export function determineUserLang(acceptedLangs: readonly string[], path: string | null = null) {
  // check url for /en/foo where en is a supported language code
  if (path !== null) {
    const urlLang = path.trim().split('/')[1]

    const matchingUrlLang = findFirstSupported([stripCountry(urlLang)])

    if (matchingUrlLang) {
      return matchingUrlLang
    }
  }

  const matchingAcceptedLang = findFirstSupported(acceptedLangs.map(stripCountry))

  return matchingAcceptedLang || DEFAULT_LANG
}

function findFirstSupported(langs: string[]) {
  const supported = Object.keys(SUPPORTED_LANGS)

  return langs.find((code) => supported.includes(code))
}

function stripCountry(lang: string) {
  return lang.trim().replace('_', '-').split('-')[0]
}
