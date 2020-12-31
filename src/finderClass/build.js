import { FinderClass } from './_finderClass'

export class Build extends FinderClass {
  constructor(finder, items = [], areas = []) {
    super(finder)

    items.forEach((item) => this.addItem(item))
    areas.forEach((area) => this.addArea(area))
  }

  addItem(id) {
    const value = this.items || []
    value.push(this.getFinder().findById(id))
    if (value.length > 6) {
      value.length = 6
    }
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

    const areas = this.getAreas().map((area) => area.name)
    const areaItems = areas.map((name) => this.getFinder().findAreaByName(name).getCountAndRate())
    for (let progress = 0; progress < areas.length; progress++) {
      const currentItems = areaItems.slice(0, progress + 1)
      const progressEquipments = this.getItems().map((item) => item.getProgressEquipment(currentItems, inventoryArray))
      progresses.push(progressEquipments)
    }

    return progresses
  }
}
