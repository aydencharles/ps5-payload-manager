import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { defaultLocale, resources } from './resources'

const storageKey = 'pldmgr.locale'

const normalizeLocale = (locale) => {
  if (!locale) return defaultLocale
  if (resources[locale]) return locale
  return defaultLocale
}

const initialLocale = normalizeLocale(window.localStorage.getItem(storageKey))

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLocale,
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false,
    },
  })

const syncLanguage = (locale) => {
  const nextLocale = normalizeLocale(locale)
  document.documentElement.lang = nextLocale
  window.localStorage.setItem(storageKey, nextLocale)
}

syncLanguage(initialLocale)

i18n.on('languageChanged', syncLanguage)

export const setAppLanguage = (locale) => i18n.changeLanguage(normalizeLocale(locale))

export { defaultLocale, supportedLocales } from './resources'
export default i18n
