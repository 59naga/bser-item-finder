import mixinCountable from '../mixins/countable'
import { FinderClass } from './_finderClass'

const CHILDREN = Symbol('children')
const PARENTS = Symbol('parents')
const STATS = Symbol('stats')
export class Item extends mixinCountable(mixinCountable(FinderClass), 'Rate') {
  static getProps(itemArray) {
    const props = {}
    const keys = ['id', 'type', 'rarity', 'stackable', 'quantity', 'parents', 'children', 'src', 'stats']
    keys.forEach((key, index) => {
      const value = itemArray[index]
      if (key === 'stats') {
        Object.defineProperty(props, STATS, { value, enumerable: true })
      } else {
        props[key] = value
      }
    })
    return props
  }

  static traverseTreeItems(items, fn) {
    return items.map((treeItem) => {
      if (!treeItem.length) {
        const result = fn(treeItem)
        return result != null ? result : treeItem
      }

      const [item, children] = treeItem
      const result = fn(item)
      const resultItems = Item.traverseTreeItems(children, fn)
      if (result != null) {
        return [result, resultItems]
      }
      return [item, resultItems]
    })
  }

  constructor(finder, itemArray) {
    super(finder)

    Object.defineProperty(this, STATS, { value: null, writable: true }) // writable but not visible
    Object.assign(this, Item.getProps(itemArray))
  }

  getRarityName() {
    return ['common', 'uncommon', 'rare', 'epic', 'legendary'][this.rarity - 1]
  }

  isWeapon() {
    return (
      [
        'dagger',
        'axe',
        'two-handed',
        'dual swords',
        'pistol',
        'assault rifle',
        'sniper rifle',
        'rapier',
        'spear',
        'hammer',
        'bat',
        'throw',
        'shuriken',
        'bow',
        'crossbow',
        'glove',
        'tonfa',
        'nunchaku',
        'guitar',
      ].indexOf(this.type) > -1
    )
  }

  getStats() {
    const statKeys = [
      'hp',
      'hpRegen',
      'hpRegenIncrease',
      'sp',
      'spRegen',
      'spRegenIncrease',
      'attack',
      'attackSpeed',
      'attackExtraDamage',
      'attackRange',
      'skillDamage',
      'skillCooldown',
      'lifeSteal',
      'criticalDamage',
      'criticalChance',
      'defense',
      'defenseAttack',
      'defenseSkill',
      'movementSpeed',
      'movementSpeedNotCombat',
      'healingReductionAttack',
      'healingReductionSkill',
      'visionRange',
      'maxAmmo',
      'trapDamage',
    ]
    const stats = {}
    statKeys.forEach((key, index) => {
      const value = this[STATS][index]
      if (value > 0) {
        stats[key] = value
      }
    })
    return stats
  }

  getParents() {
    return this.loadParents()
  }

  loadParents() {
    if (!this[PARENTS]) {
      const value = this.parents.map((parent) => this.getFinder().findById(parent))
      Object.defineProperty(this, PARENTS, { value })
    }
    return this[PARENTS]
  }

  getComponents() {
    const components = []

    this.loadChildren().forEach((child) => {
      const notComponent = child.children && child.children.length
      if (notComponent) {
        child.getComponents().forEach((child) => {
          components.push(child)
        })
        return
      }

      components.push(child)
    })

    return components
  }

  getChildEquipments() {
    const childEquipments = []

    this.loadChildren().forEach((child) => {
      const notComponent = child.children && child.children.length
      if (notComponent) {
        childEquipments.push(child)
        child.getChildEquipments().forEach((child) => {
          childEquipments.push(child)
        })
      }
    })

    return childEquipments
  }

  getTree() {
    const children = []

    this.loadChildren().forEach((child) => {
      const grandChildren = []
      if (child.children && child.children.length) {
        child.getTree().forEach((child) => {
          grandChildren.push(child)
        })
      }

      if (grandChildren.length) {
        children.push([child, grandChildren])
      } else {
        children.push(child)
      }
    })

    return children
  }

  getChildren() {
    return this.loadChildren()
  }

  loadChildren() {
    if (!this[CHILDREN]) {
      const value = this.children.map((child) => this.getFinder().findById(child))
      Object.defineProperty(this, CHILDREN, { value })
    }
    return this[CHILDREN]
  }

  getComponentOrigins(excludeId) {
    const componentOrigins = {}

    this.getComponents().forEach((component) => {
      const { id } = component
      if (id === excludeId) {
        return
      }
      this.getFinder()
        .countPerAreas(id)
        .forEach((area) => {
          const { name, count, animals } = area
          if (!componentOrigins[name]) {
            componentOrigins[name] = []
          }

          componentOrigins[name].push({ id, count, animals })
        })
    })

    return componentOrigins
  }

  getProgressEquipment(areaItems, inventory = []) {
    const families = [this]
    const tree = this.getTree()
    Item.traverseTreeItems(tree, (item) => {
      if (this.type !== item.type) {
        return
      }
      families.push(item)
    })

    const countDefault = []
    inventory.forEach((idOrArray) => {
      if (typeof idOrArray === 'string') {
        countDefault.push([idOrArray, 1])
      } else {
        countDefault.push(idOrArray)
      }
    })
    const availableItems = areaItems.reduce((left, right) => left.concat(right), countDefault)

    const equipment = families.find((family) => {
      const componentIds = family.getComponents().map((item) => item.id)
      if (!componentIds.length) {
        const isInstantEquipment = availableItems.find(([areaItemId]) => areaItemId === family.id)
        return isInstantEquipment
      }
      const obtainableIds = componentIds.filter((id) => availableItems.find(([areaItemId]) => areaItemId === id))
      return componentIds.length === obtainableIds.length
    })

    return equipment || null
  }
}
