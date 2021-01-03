import { FinderClass } from './_finderClass'

const ITEMS = Symbol('ITEMS')
const ANIMALS = Symbol('ANIMALS')
export class Area extends FinderClass {
  static getProps(array = []) {
    const props = {}
    const keys = ['name', 'items', 'animals']
    keys.forEach((key, index) => {
      const value = array[index]
      props[key] = value
    })
    return props
  }

  constructor(finder, array) {
    super(finder)

    Object.assign(this, Area.getProps(array))
  }

  getCountAndRate(gteRate = 0.3, includeAlways = ['meteorite', 'mithril']) {
    const items = []

    this.getItems()
      .filter((item) => item.getCount())
      .forEach((item) => items.push(item))
    this.getAnimals().forEach((animal) => {
      animal
        .getItems()
        .filter((item) => item.getRate() >= gteRate || includeAlways.indexOf(item.id) > -1)
        .forEach((item) => {
          item.setCount(animal.getCount())
          item.setOwner(animal.name)
          items.push(item)
        })
    })

    return items
  }

  getItems() {
    return this.loadItems()
  }

  loadItems() {
    if (!this[ITEMS]) {
      const value = this.items.map(([id, count]) => {
        const item = this.getFinder().findById(id)
        item.setCount(count)
        return item
      })
      Object.defineProperty(this, ITEMS, { value })
    }
    return this[ITEMS]
  }

  getAnimals() {
    return this.loadAnimals()
  }

  loadAnimals() {
    if (!this[ANIMALS]) {
      const value = this.animals.map(([name, count]) => {
        const animal = this.getFinder().findAnimal(name)
        animal.setCount(count)
        animal.getItems()
        return animal
      })
      Object.defineProperty(this, ANIMALS, { value })
    }
    return this[ANIMALS]
  }
}
