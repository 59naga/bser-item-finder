import { I18n } from './i18n'
import { Item } from './finderClass/item'
import { Character } from './finderClass/character'
import { Weapon } from './finderClass/weapon'
import { Area } from './finderClass/area'
import { Animal } from './finderClass/animal'
import { Build } from './finderClass/build'
import { Inventory } from './finderClass/inventory'

import { version } from '../package'

const ITEMS = Symbol('ITEMS')
const CHARACTERS = Symbol('CHARACTERS')
const WEAPONS = Symbol('WEAPONS')
const AREAS = Symbol('AREAS')
const ANIMALS = Symbol('ANIMALS')
export class Finder extends I18n {
  constructor(dictJsons, i18n) {
    super(i18n)

    const [dictItems, dictCharacters, dictWeapons, dictAreas, dictAnimals] = dictJsons.map((obj) => {
      // Fix: Avoid changing argument properties directly
      return JSON.parse(JSON.stringify(obj))
    })
    Object.defineProperty(this, 'version', { value: version })
    Object.defineProperty(this, ITEMS, { value: dictItems })
    Object.defineProperty(this, CHARACTERS, { value: dictCharacters })
    Object.defineProperty(this, WEAPONS, { value: dictWeapons })
    Object.defineProperty(this, AREAS, { value: dictAreas })
    Object.defineProperty(this, ANIMALS, { value: dictAnimals })
  }

  findById(id) {
    const lowered = String(id).toLowerCase()
    const foundArray = this[ITEMS].find((array) => {
      const props = Item.getProps(array)
      return props.id === lowered
    })
    if (!foundArray) {
      return null
    }

    return new Item(this, foundArray)
  }

  findCharacterByName(name) {
    const lowered = String(name).toLowerCase()
    const foundArray = this[CHARACTERS].find((array) => {
      const props = Character.getProps(array)
      return props.name === lowered
    })
    if (!foundArray) {
      return null
    }

    return new Character(this, foundArray)
  }

  findWeaponByType(type) {
    const lowered = String(type).toLowerCase()
    const foundArray = this[WEAPONS].find((array) => {
      const props = Weapon.getProps(array)
      return props.type === lowered
    })
    if (!foundArray) {
      return null
    }

    return new Weapon(this, foundArray)
  }

  findAreaByName(name) {
    const lowered = String(name).toLowerCase()
    const foundArray = this[AREAS].find((array) => {
      const props = Area.getProps(array)
      return props.name === lowered
    })
    if (!foundArray) {
      return null
    }

    return new Area(this, foundArray)
  }

  getFirstWeapons() {
    const firstWepapons = []
    this[WEAPONS].forEach((array) => {
      const props = Weapon.getProps(array)
      const isSecretType = !props.id
      if (isSecretType) {
        return
      }

      firstWepapons.push(this.findById(props.id))
    })
    return firstWepapons
  }

  findAnimal(name) {
    const nameLowered = String(name).toLowerCase()
    const foundArray = this[ANIMALS].find((weaponArray) => {
      const props = Animal.getProps(weaponArray)
      return props.name === nameLowered
    })

    return new Animal(this, foundArray)
  }

  createBuild(items, areas) {
    return new Build(this, items, areas)
  }

  createInventory(array) {
    return new Inventory(this, array)
  }

  // TODO
  findItems(options = {}) {
    const found = this[ITEMS].filter((array) => {
      return Item.execConditions(array, options.where)
    }).map((array, index) => {
      const item = new Item(this, array)
      item.setIndex(index)
      return item
    })

    if (options.order) {
      Item.sort(found, options.order)
    }

    return found
  }

  findCharacters(options = {}) {
    return this[CHARACTERS].filter((array) => {
      return Character.execConditions(array, options.where)
    }).map((array) => {
      return new Character(this, array)
    })
  }

  findWeapons(options = {}) {
    return this[WEAPONS].filter((array) => {
      return Weapon.execConditions(array, options.where)
    }).map((array) => {
      return new Weapon(this, array)
    })
  }

  findAreas(options = {}) {
    return this[AREAS].filter((array) => {
      return Area.execConditions(array, options.where)
    }).map((array) => {
      return new Area(this, array)
    })
  }

  findAnimals(options = {}) {
    return this[ANIMALS].filter((array) => {
      return Animal.execConditions(array, options.where)
    }).map((array) => {
      return new Animal(this, array)
    })
  }
}
