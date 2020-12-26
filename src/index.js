import dictAnimals from './dict/animals.json'
import dictAreas from './dict/areas.json'
import dictCharacters from './dict/characters.json'
import dictItems from './dict/items.json'
import dictWeapons from './dict/weapons.json'
import { Item } from './item'
import { Chara } from './chara'

export { version } from '../package'

export function find(...args) {
  return findById(...args)
}
export function findById(id) {
  const itemArray = dictItems.find(([name]) => name.toLowerCase() === String(id).toLowerCase())
  if (itemArray) {
    return new Item(itemArray)
  }
  return null
}
export function findOne(conditions = {}, options = {}) {
  return (findAll(conditions, { ...options, limit: 1 }) || [])[0]
}
export function findParents(children, conditions = {}, options = {}) {
  const parents = findAll({ children }, { ...options })

  // 検索対象はツリーから除外する
  const childIds = (typeof children === 'string' ? [children] : children).map((id) => {
    return id.toLowerCase()
  })
  parents.forEach((parent) => {
    parent.children.forEach((child, index) => {
      if (childIds.indexOf(child.id) > -1) {
        parent.children.splice(index, 1)
      }
    })
  })

  return parents
}
export function findCreatableAreas(id, withOutMaterials = []) {
  const creatables = []

  let materials = findById(id).getMaterials()
  if (!materials.length) {
    return creatables
  }
  materials = materials.filter((material) => {
    return toArray(withOutMaterials).indexOf(material.id) === -1
  })

  const [{ areas: firstAreas }, ...anotherItems] = materials
  const allMatchedAreaNames = firstAreas
    .filter((firstArea) => {
      const anotherItemMatched = anotherItems.filter(({ id, areas: anotherAreas }) => {
        const found = anotherAreas.find((anotherArea) => anotherArea.name === firstArea.name)
        if (!found) {
          return false
        }
        return found.amount != null || found.animals.length
      })

      return anotherItems.length === anotherItemMatched.length
    })
    .map((area) => area.name)

  allMatchedAreaNames.forEach((areaName) => {
    creatables.push([
      areaName,
      materials.map((item) => {
        const area = item.areas.find((area) => area.name === areaName)
        return [item.id, area.amount, ...area.animals.map((animal) => [animal.name, animal.rate])]
      }),
    ])
  })

  return creatables
}
export function findCreatableHighRarityItems(conditions = {}) {
  const highRarityItems = findAll({ ...conditions, rarity: { gte: 2 }, children: { gte: 2 } })

  const areas = {}
  dictAreas.forEach((area) => {
    const [areaName, areaMaterials] = area
    const materialNames = getAreaMaterialIds(areaMaterials)

    const creatables = highRarityItems.filter((item) => {
      const names = item.getMaterials().map((material) => material.id)
      const nameMatched = names.filter((name) => materialNames.indexOf(name) > -1)
      return names.length === nameMatched.length
    })

    areas[areaName] = creatables
  })

  return areas
}
export function findAll(conditions = {}, options = {}) {
  const found = dictItems
    .filter((itemArray) => {
      const props = Item.extractProperties(itemArray)
      return Item.getCondition(props, conditions)
    })
    .filter((itemArray, index) => {
      if (options.limit > 0 && options.offset > 0) {
        return index >= options.offset && index < options.offset + options.limit
      } else if (options.limit > 0) {
        return index < options.limit
      } else if (options.offset > 0) {
        return index >= options.offset
      }
      return true
    })

  return found.map((itemArray) => new Item(itemArray))
}

export function toArray(strOrArray) {
  return strOrArray instanceof Array ? strOrArray : [strOrArray]
}

export function getTypes() {
  const types = []
  const typeSubs = {}

  dictItems.forEach((itemArray) => {
    const props = Item.extractProperties(itemArray)
    if (types.indexOf(props.type) === -1) {
      types.push(props.type)
      typeSubs[props.type] = []
    } else if (props.typeSub && typeSubs[props.type].indexOf(props.typeSub) === -1) {
      typeSubs[props.type].push(props.typeSub)
    }
  })

  const flatten = []
  types
    .map((type) => [type, typeSubs[type]])
    .forEach(([type, typeSub]) => {
      if (typeSub.length) {
        typeSub.forEach((name) => {
          flatten.push(name)
        })
        return
      }

      flatten.push(type)
    })
  return flatten
}

export function getCharacters() {
  const characters = []

  dictCharacters.forEach((dictData) => {
    characters.push(new Chara(dictData))
  })

  return characters
}

export function getAreaMaterialIds(materials) {
  const materialNames = []

  materials
    .map(([materialName, materialCount]) => {
      const [, animalMaterials] = dictAnimals.find(([animalName]) => materialName === animalName) || [null, []]
      const realisticMaterials = animalMaterials.filter(([materialName, rate]) => rate >= 0.3)
      return [materialName, materialCount, realisticMaterials]
    })
    .filter(([materialName, materialCount, realisticMaterials]) => {
      return materialCount > 0 || realisticMaterials.length
    })
    .forEach(([materialName, materialCount, realisticMaterials]) => {
      if (realisticMaterials.length) {
        realisticMaterials.forEach(([materialName]) => {
          if (materialNames.indexOf(materialName) > -1) {
            return
          }
          materialNames.push(materialName)
        })
      } else {
        materialNames.push(materialName)
      }
    })

  return materialNames
}

export function countMaterials(id) {
  const count = {}
  findAll({ id }).forEach((item) =>
    item.getMaterials().forEach((item) => {
      if (!count[item.id]) {
        count[item.id] = 0
      }
      count[item.id]++
    })
  )

  return Object.entries(count)
}

export function progressPerAreas(areas, id, firstEquipmentId = null) {
  const progresses = []

  const items = findAll({ id }).sort((a, b) => id.indexOf(a.id) - id.indexOf(b.id))
  const relatedEquipments = getRelatedEquipments(items)

  for (let index = 0; index < areas.length; index++) {
    const currentAreas = areas.slice(0, index + 1)
    const equipments = findCreatableRelatedEquipments(currentAreas, relatedEquipments, firstEquipmentId)
    progresses.push(equipments)
  }

  return progresses
}

export function getRelatedEquipments(items) {
  const relatedEquipments = []

  items.forEach((item) => {
    const equipments = []
    if (item.type === 'armor' || item.type === 'weapon') {
      equipments.push(item)
    }

    item.getComponents().forEach((component) => {
      const notEquipment = !(component.type === 'armor' || component.type === 'weapon')
      if (notEquipment) {
        return
      }

      if (!equipments.find((relatedItem) => relatedItem.id === component.id)) {
        equipments.push(component)
      }
    })

    relatedEquipments.push(equipments)
  })

  return relatedEquipments
}

export function findCreatableRelatedEquipments(areaNames, relatedEquipments, firstEquipmentId = null) {
  const materials = []
  if (firstEquipmentId) {
    materials.push(firstEquipmentId)
  }
  areaNames.forEach((areaName) => {
    const [, areaMaterials] = dictAreas.find(([dictAreaName]) => dictAreaName === areaName)
    getAreaMaterialIds(areaMaterials).forEach((material) => {
      if (materials.indexOf(material) === -1) {
        materials.push(material)
      }
    })
  })
  return relatedEquipments.map((equipments) => {
    return equipments.find((item) => {
      const names = item.getMaterials().map((material) => material.id)
      const nameMatched = names.filter((name) => materials.indexOf(name) > -1)
      return names.length === nameMatched.length
    })
  })
}

export function getAreaItems(name) {
  let items = []

  dictAreas.forEach((area) => {
    const [areaName, areaMaterials] = area
    if (areaName !== name) {
      return
    }
    items = getAreaMaterialIds(areaMaterials).map((id) => findById(id))
  })

  return items
}

export function getAreaItemsOnlyEquipments(name, equipmentIds) {
  const areaItemIds = getAreaItems(name).map(item => item.id)

  const materials = []
  findAll({ id: equipmentIds })
    .sort((a, b) => equipmentIds.indexOf(a.id) - equipmentIds.indexOf(b.id))
    .forEach((item) => {
      item.getMaterials().forEach((material) => {
        if (areaItemIds.indexOf(material.id) === -1) {
          return
        }
        if (materials.find((exists) => exists.id === material.id)) {
          return
        }
        materials.push(material)
      })
    })

  return materials
}

export function getFirstEquipments() {
  const id = dictWeapons.map(([, id]) => id)
  return findAll({ id })
}
