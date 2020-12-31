import { FinderClass } from './_finderClass'

export class Character extends FinderClass {
  static getProps(array = []) {
    const props = {}
    const keys = ['name', 'src', 'weapons']
    keys.forEach((key, index) => {
      const value = array[index]
      props[key] = value
    })
    return props
  }

  constructor(finder, array) {
    super(finder)

    Object.assign(this, Character.getProps(array))
  }
}
