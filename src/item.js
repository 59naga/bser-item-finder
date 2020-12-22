import dictAnimals from './dict/animals.json'
import dictAreas from './dict/areas.json'
import dictItems from './dict/items.json'
import localeJa from './locales/ja.json'

import { imagepPrefixUrl, imageSuffixUrl } from './constant'

export class Item {
  // convert array values to object key-value
  static extractProperties(itemArray) {
    const [id, src, details, parents, children] = itemArray
    const [type, typeSub, rarity, stats, stackable, quantity] = details
    return {
      id,
      src,
      type,
      typeSub,
      rarity,
      stats,
      stackable,
      quantity,
      parents,
      children,
      areas: [],
      ja: {
        id: Item.getLocaleJa(id),
        type: Item.getLocaleJa(type),
        typeSub: Item.getLocaleJa(typeSub),
        stats: Item.getLocaleJa(stats),
      },
    }
  }

  static getLocaleJa(str) {
    if (str == null || !str) {
      return str
    }
    const key = String(str).toLowerCase().replace(/_/g, ' ')
    const locale = localeJa[key]
    if (locale == null) {
      // console;.log(`key "${key}" undefined in src/locales/ja.json`)
    }
    return locale || str
  }

  static getCondition(props, conditions = {}) {
    let { stats, type, rarity, parents, children, weaponThenOnly } = conditions
    if (typeof stats === 'string') {
      stats = new RegExp(stats)
    }
    if (typeof parents === 'string') {
      parents = [parents]
    }
    if (typeof children === 'string') {
      children = [children]
    }

    // 不合致したものにfalseを返す
    if (type != null && type !== props.type && type !== props.typeSub) {
      return false
    }
    if (typeof rarity === 'number' && rarity !== props.rarity) {
      return false
    }
    if (rarity != null && rarity.gte != null && rarity.gte > props.rarity) {
      return false
    }
    if (stats instanceof RegExp && props.stats.match(stats) == null) {
      return false
    }
    if (
      parents instanceof Array &&
      !parents.find((parent) => {
        return props.parents.indexOf(String(parent).toLowerCase()) > -1
      })
    ) {
      return false
    }
    if (
      children instanceof Array &&
      !children.find((child) => {
        return props.children.indexOf(String(child).toLowerCase()) > -1
      })
    ) {
      return false
    }
    const notGteChildrenLength = children != null && children.gte != null && children.gte > props.children.length
    if (notGteChildrenLength) {
      return false
    }

    const unmatchedWeapon = typeof weaponThenOnly === 'string' && props.type === 'weapon' && props.typeSub !== weaponThenOnly
    if (unmatchedWeapon) {
      return false
    }

    // 条件による絞込みが存在した場合は合致したものだけtrueとなる
    return true
  }

  static getAnimals(propId, areaName) {
    const animals = []

    dictAnimals.forEach((animal) => {
      const [animalName, drops] = animal
      drops.forEach((drop) => {
        const [dropName, rate] = drop
        if (dropName !== propId) {
          return
        }

        dictAreas.forEach((area) => {
          const [name, materials] = area
          if (name !== areaName) {
            return
          }
          materials.forEach(([materialName, count]) => {
            if (materialName !== animalName) {
              return
            }
            if (!count) {
              return
            }
            if (rate < 0.3) {
              // ドロップ率が稀のものをエリアの素材として扱わない
              return
            }
            animals.push({ name: animalName, count, rate })
          })
        })
      })
    })

    return animals
  }

  static getDefaultEquipments() {
    return [
      'kitchen knife',
      'rusty sword',
      'hatchet',
      'walther ppk',
      'fedorova',
      'long rifle',
      'needle',
      'short spear',
      'hammer',
      'short rod',
      'baseball',
      'razor',
      'bow',
      'short crossbow',
      'cotton glove',
      'bamboo',
      'starter guitar',
      'steel chain',
    ]
  }

  constructor(id, options = {}) {
    let itemArray = id
    if (typeof id === 'string') {
      const key = String(id).toLowerCase()
      itemArray = dictItems.find(([name]) => name === key)
    }

    if (!itemArray) {
      return null
    }

    const props = Item.extractProperties(itemArray)

    // modify properties
    if (options.includeParents !== false) {
      props.parents = props.parents.map((parent) => new Item(parent, { includeChildren: false }))
    }
    if (options.includeChildren !== false) {
      props.children = props.children.map((child) => new Item(child, { includeParents: false }))
    }
    dictAreas.forEach((area) => {
      const [name, materials] = area

      let amount = null
      materials.forEach(([materialName, materialAmount]) => {
        if (materialName !== props.id) {
          return
        }
        if (!materialAmount) {
          return
        }
        amount = materialAmount
      })

      const animals = Item.getAnimals(props.id, name)
      if (amount != null || animals.length) {
        props.areas.push({ name, amount, animals })
      }
    })

    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
  }

  getSrc() {
    return `${imagepPrefixUrl}${this.src}`
  }

  getSrcThumbnail(scale = 100) {
    return `${imagepPrefixUrl}${this.src}${imageSuffixUrl}${scale}`
  }

  getMaterials() {
    const materials = []

    this.children.forEach((child) => {
      if (child.children && child.children.length) {
        child.getMaterials().forEach((child) => {
          materials.push(child)
        })
        return
      }

      materials.push(child)
    })

    return materials
  }
}
