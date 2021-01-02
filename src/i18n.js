export class I18n {
  constructor(i18n) {
    const value = JSON.parse(JSON.stringify(i18n)) // Fix: Avoid changing argument properties directly
    Object.defineProperty(this, 'locales', { value })
    Object.defineProperty(this, 'lang', { value: 'en', writable: true })

    const isBrowser = typeof window !== 'undefined' && navigator && navigator.language
    if (isBrowser) {
      try {
        this.setLang(navigator.language)
      } catch (error) {
        // ignore "Cannot change..."
      }
    }
  }

  setLang(value) {
    const available = Object.keys(this.locales)
    if (available.indexOf(value) === -1) {
      throw new Error(`Cannot change language to ${value}. available in ${available.join(', ')}.`)
    }
    Object.defineProperty(this, 'lang', { value })
  }

  getLang(lang) {
    return this.lang
  }

  setLocales(locales) {
    Object.entries(locales).forEach(([lang, defines]) => {
      if (!this.locales[lang]) {
        this.locales[lang] = {}
      }
      Object.entries(defines).forEach(([key, value]) => {
        this.locales[lang][key] = value
      })
    })
  }

  __(str, lang) {
    const chosenLang = lang || this.lang
    const chosenLocale = this.locales[chosenLang] || {}
    return chosenLocale[str] || this.locales.en[str] || str
  }
}
