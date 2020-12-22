import dictAnimals from './dict/animals.json'
import dictAreas from './dict/areas.json'
import dictCharacters from './dict/characters.json'
import dictItems from './dict/items.json'
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
export function findChildren(parents, conditions = {}, options = {}) {
  const children = findAll({ parents }, { ...options })

  // 検索対象はツリーから除外する
  const parentIds = (typeof parents === 'string' ? [parents] : parents).map((id) => {
    return id.toLowerCase()
  })
  children.forEach((child) => {
    child.parents.forEach((parent, index) => {
      if (parentIds.indexOf(parent.id) > -1) {
        child.parents.splice(index, 1)
      }
    })
  })

  return children
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
    const [name, materials] = area
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

    const creatables = highRarityItems.filter((item) => {
      if (!item.getMaterials) {
        return false
      }
      const names = item.getMaterials().map((material) => material.id)
      const nameMatched = names.filter((name) => materialNames.indexOf(name) > -1)
      return names.length === nameMatched.length
    })

    areas[name] = creatables
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
