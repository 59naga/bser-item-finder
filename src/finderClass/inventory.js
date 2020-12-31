import { FinderClass } from './_finderClass'

export class Inventory extends FinderClass {
  constructor(finder, array, maxLength = 10) {
    super(finder)

    this.items = this.parseArray(array)
    this.maxLength = maxLength
  }

  parseArray(array) {
    const items = []

    array.forEach((idOrArray) => {
      let item
      if (typeof idOrArray === 'string') {
        item = this.getFinder().findById(idOrArray)
        item.setCount(1)
      }
      if (idOrArray instanceof Array) {
        const [id, count] = idOrArray
        item = this.getFinder().findById(id)
        item.setCount(count || 1)
      }

      if (!item) {
        return
      }
      items.push(item)
    })

    return items
  }

  addItem(id) {
    this.items.push(this.getFinder().findById(id))
    if (this.items.length > this.maxLength) {
      this.items.length = this.maxLength
    }
  }
}
