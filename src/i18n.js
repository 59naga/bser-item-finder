export class I18n {
  constructor(i18n) {
    Object.defineProperty(this, 'locales', { value: i18n })
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

  __(str) {
    return this.locales[this.lang][str] || this.locales.en[str] || str
  }
}
