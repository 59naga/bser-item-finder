const imagepPrefixUrl = 'https://static.wikia.nocookie.net/blacksurvivaleternalreturn_gamepedia_en/images/'

const FINDER = Symbol('FINDER')
export class FinderClass {
  constructor(finder) {
    Object.defineProperty(this, FINDER, { value: finder })
  }

  getSrc() {
    return `${imagepPrefixUrl}${this.src}`
  }

  getFinder() {
    return this[FINDER]
  }

  static execConditions(array, conditions) {
    return true
  }
}
