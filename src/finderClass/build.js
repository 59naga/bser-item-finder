import { FinderClass } from './_finderClass'
import { Item } from './item'

export class Build extends FinderClass {
  constructor(finder, items = [], areas = []) {
    super(finder)

    items.forEach((item) => this.addItem(item))
    areas.forEach((area) => this.addArea(area))
  }

  addItem(id) {
    const value = this.items || []
    value.push(this.getFinder().findById(id))
    Object.defineProperty(this, 'items', { value, writable: true })
  }

  getItems(id) {
    return this.items || []
  }

  removeItemByIndex(index) {
    const value = this.items || []
    value.splice(index, 1)
    Object.defineProperty(this, 'items', { value, writable: true })
  }

  addArea(name) {
    const value = this.areas || []
    value.push(this.getFinder().findAreaByName(name))
    Object.defineProperty(this, 'areas', { value, writable: true })
  }

  getAreas(name) {
    return this.areas || []
  }

  removeArea(name) {
    const value = this.areas || []
    const index = value.findIndex((area) => area.name === name)
    if (index > -1) {
      value.splice(index, 1)
    }
    Object.defineProperty(this, 'areas', { value, writable: true })
  }

  countMaterials() {
    const materials = []

    this.getItems().forEach((item) => {
      item.getComponents().forEach((component) => {
        const material = materials.find((material) => material.id === component.id)
        if (material) {
          material.upCount()
          return
        }
        component.upCount()
        materials.push(component)
      })
    })

    return materials
  }

  getProgresses(inventoryArray = []) {
    const progresses = []

    const areas = this.getAreas()
    const areasItems = areas.map((area) => this.getFinder().findAreaByName(area.name).getCountAndRate())
    for (let progress = 0; progress < areas.length; progress++) {
      const currentItems = areasItems.slice(0, progress + 1).map((areaItems) => areaItems.map((item) => item.clone()))
      const progressEquipments = this.getItems().map((item) => item.getProgressEquipment(currentItems, inventoryArray))
      progresses.push([areas[progress], progressEquipments])
    }

    return progresses
  }

  calcTotalStats() {
    const stats = {}
    const healingReductions = []
    Item.getStatsKeys().forEach((key) => {
      stats[key] = 0
    })

    this.getItems()
      .filter((item) => item.isWeapon() || item.isArmor())
      .forEach((item) => {
        Object.entries(item.getStats()).forEach(([key, value]) => {
          if (key.indexOf('healingReduction') === 0) {
            healingReductions.push({ [key]: value })
            return
          }
          stats[key] += value * 100
        })
      })

    // HACK: fix javascript floating point math bug(eg: 0.01 + 0.05 = 0.060000000000000005)
    Object.entries(stats).forEach(([key, value]) => {
      if (value === 0) {
        delete stats[key]
        return
      }
      stats[key] = value / 100
    })

    return [stats, healingReductions]
  }
}
