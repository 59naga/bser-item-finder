import { I18n } from './i18n'
import { Item } from './finderClass/item'
import { Weapon } from './finderClass/weapon'
import { Area } from './finderClass/area'
import { Animal } from './finderClass/animal'
import { Build } from './finderClass/build'
import { Inventory } from './finderClass/inventory'

import { version } from '../package'

const ITEMS = Symbol('ITEMS')
const WEAPONS = Symbol('WEAPONS')
const AREAS = Symbol('AREAS')
const ANIMALS = Symbol('ANIMALS')
export class Finder extends I18n {
  constructor(dictItems, dictWeapons, dictAreas, dictAnimals, i18n) {
    super(i18n)
    Object.defineProperty(this, 'version', { value: version })
    Object.defineProperty(this, ITEMS, { value: dictItems })
    Object.defineProperty(this, WEAPONS, { value: dictWeapons })
    Object.defineProperty(this, AREAS, { value: dictAreas })
    Object.defineProperty(this, ANIMALS, { value: dictAnimals })
  }

  findById(id) {
    const idLowered = String(id).toLowerCase()
    const foundArray = this[ITEMS].find((array) => {
      const props = Item.getProps(array)
      return props.id === idLowered
    })
    if (!foundArray) {
      return null
    }

    return new Item(this, foundArray)
  }

  findWeaponByType(type) {
    const typeLowered = String(type).toLowerCase()
    const foundArray = this[WEAPONS].find((array) => {
      const props = Weapon.getProps(array)
      return props.type === typeLowered
    })
    if (!foundArray) {
      return null
    }

    return new Weapon(this, foundArray)
  }

  findAreaByName(name) {
    const nameLowered = String(name).toLowerCase()
    const foundArray = this[AREAS].find((array) => {
      const props = Area.getProps(array)
      return props.name === nameLowered
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
      if (!props.id) {
        return
      }

      firstWepapons.push(this.findById(props.id))
    })
    return firstWepapons
  }

  countPerAreas(id) {
    const areas = []

    this[AREAS].forEach((array) => {
      const area = new Area(this, array)
      const item = area.getItems().find((item) => item.id === id)
      const count = item ? item.getCount() : 0
      const animals = area
        .getAnimals()
        .filter((animal) => {
          const item = animal.getItems().find((item) => item.id === id)
          if (item && item.isWeapon()) {
            // 武器の直ドロは除外
            return false
          }
          return !!item
        })
        .map((animal) => {
          const item = animal.getItems().find((item) => item.id === id)
          const name = animal.name
          const rate = item.getRate()
          const count = animal.getCount()
          return { name, rate, count }
        })

      if (count > 0 || animals.length) {
        const { name } = area
        areas.push({ name, count, animals })
      }
    })

    return areas
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
  findWeapons(conditions) {
    return this[WEAPONS].filter((array) => {
      return Weapon.execConditions(array, conditions)
    }).map((array) => {
      return new Weapon(this, array)
    })
  }

  findAreas(conditions) {
    return this[AREAS].filter((array) => {
      return Area.execConditions(array, conditions)
    }).map((array) => {
      return new Area(this, array)
    })
  }

  findAnimals(conditions) {
    return this[ANIMALS].filter((array) => {
      return Animal.execConditions(array, conditions)
    }).map((array) => {
      return new Animal(this, array)
    })
  }

  findItems(conditions) {
    return this[ITEMS].filter((array) => {
      return Item.execConditions(array, conditions)
    }).map((array) => {
      return new Item(this, array)
    })
  }
}
