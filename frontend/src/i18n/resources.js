export const defaultLocale = 'en'

const localeModules = import.meta.glob('./locales/*.js', { eager: true })

const readLocaleEntry = ([path, module]) => {
  const locale = module.default

  if (!locale || typeof locale !== 'object') {
    throw new Error(`Invalid locale module: ${path}`)
  }

  if (!locale.code || !locale.label || !locale.translation) {
    throw new Error(`Locale module is missing required fields: ${path}`)
  }

  return locale
}

const locales = Object.entries(localeModules)
  .map(readLocaleEntry)
  .sort((left, right) => {
    if (left.code === defaultLocale) return -1
    if (right.code === defaultLocale) return 1
    return left.code.localeCompare(right.code)
  })

export const supportedLocales = locales.map(({ code, label }) => ({ code, label }))

export const resources = locales.reduce((accumulator, locale) => {
  accumulator[locale.code] = {
    translation: locale.translation,
  }
  return accumulator
}, {})
