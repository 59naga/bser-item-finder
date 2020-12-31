import mixinCountable from '../mixins/countable'
import { FinderClass } from './_finderClass'

const ITEMS = Symbol('ITEMS')
export class Animal extends mixinCountable(FinderClass) {
  static getProps(array = []) {
    const props = {}
    const keys = ['name', 'items', 'spawn', 'respawn']
    keys.forEach((key, index) => {
      const value = array[index]
      props[key] = value
    })
    return props
  }

  constructor(finder, array) {
    super(finder)

    Object.defineProperty(this, 'items', { value: null, writable: true }) // writable but not visible
    Object.assign(this, Animal.getProps(array))
  }

  getItems() {
    return this.loadItems()
  }

  loadItems() {
    if (!this[ITEMS]) {
      const value = this.items.map(([id, rate]) => {
        const item = this.getFinder().findById(id)
        item.setRate(rate)
        return item
      })
      Object.defineProperty(this, ITEMS, { value })
    }
    return this[ITEMS]
  }
}
