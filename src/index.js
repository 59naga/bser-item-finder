import dictItems from "./dict/items.json";
import dictAreas from "./dict/areas.json";
import dictAnimals from "./dict/animals.json";
import localeJa from "./locales/ja.json";

const imagepPrefixUrl =
  "https://static.wikia.nocookie.net/blacksurvivaleternalreturn_gamepedia_en/images/";
const imageSuffixUrl = "/revision/latest/scale-to-width-down/100";
const defaultItemNames = [
  "water",
  "bread"
  // default weapons
  // "kitchen knife",
  // "rusty sword",
  // "hatchet",
  // "walther ppk",
  // "fedorova",
  // "long rifle",
  // "needle",
  // "short spear",
  // "hammer",
  // "short rod",
  // "baseball",
  // "razor",
  // "bow",
  // "short crossbow",
  // "cotton glove",
  // "bamboo",
  // "starter guitar",
  // "steel chain",
];

export function find(...args) {
  return findById(...args);
}
export function findById(id) {
  const itemArray = dictItems.find(([name]) => name.toLowerCase() === String(id).toLowerCase());
  if (itemArray) {
    return new Item(itemArray);
  }
  return null;
}
export function findOne(conditions = {}, options = {}) {
  return (findAll(conditions, { ...options, limit: 1 }) || [])[0];
}
export function findParents(children, conditions = {}, options = {}) {
  const parents = findAll({ children }, { ...options });

  // 検索対象はツリーから除外する
  const childIds = (typeof children === "string" ? [children] : children).map(id => {
    return id.toLowerCase();
  });
  parents.forEach(parent => {
    parent.children.forEach((child, index) => {
      if (childIds.indexOf(child.id) > -1) {
        parent.children.splice(index, 1);
      }
    });
  });

  return parents;
}
export function findChildren(parents, conditions = {}, options = {}) {
  const children = findAll({ parents }, { ...options });

  // 検索対象はツリーから除外する
  const parentIds = (typeof parents === "string" ? [parents] : parents).map(id => {
    return id.toLowerCase();
  });
  children.forEach(child => {
    child.parents.forEach((parent, index) => {
      if (parentIds.indexOf(parent.id) > -1) {
        child.parents.splice(index, 1);
      }
    });
  });

  return children;
}
export function findCreatableAreas(id, withOutMaterials = []) {
  const creatables = [];

  let materials = findById(id).getMaterials();
  if (!materials.length) {
    return creatables;
  }
  materials = materials.filter(material => {
    return defaultItemNames.concat(toArray(withOutMaterials)).indexOf(material.id) === -1;
  });

  const [{ areas: firstAreas }, ...anotherItems] = materials;
  const allMatchedAreaNames = firstAreas
    .filter(firstArea => {
      const anotherItemMatched = anotherItems.filter(({ id, areas: anotherAreas }) => {
        const found = anotherAreas.find(anotherArea => anotherArea.name === firstArea.name);
        if (!found) {
          return false;
        }
        return found.amount != null || found.animals.length;
      });

      return anotherItems.length === anotherItemMatched.length;
    })
    .map(area => area.name);

  allMatchedAreaNames.forEach(areaName => {
    creatables.push(
      areaName,
      materials.map(item => {
        const area = item.areas.find(area => area.name === areaName);
        return [
          item.id,
          area.amount,
          ...area.animals.map(animal => [animal.name, animal.rate].join(","))
        ];
      })
    );
  });

  return creatables;
}
export function findCreatableHighRarityItems() {
  const highRarityItems = findAll({ rarity: { gte: 2 }, children: {gte: 1} });

  const areas = {}
  dictAreas.forEach(area => {
    const [name, materials] = area;
    const materialNames = [];
    materials
      .map(([materialName, materialCount]) => {
        const [, animalMaterials] = dictAnimals.find(
          ([animalName]) => materialName === animalName
        ) || [null, []];
        const realisticMaterials = animalMaterials.filter(([materialName, rate]) => rate >= 0.3);
        return [materialName, materialCount, realisticMaterials];
      })
      .filter(([materialName, materialCount, realisticMaterials]) => {
        return materialCount > 0 || realisticMaterials.length;
      })
      .forEach(([materialName, materialCount, realisticMaterials]) => {
        if (realisticMaterials.length) {
          realisticMaterials.map(([materialName]) => {
            if (materialNames.indexOf(materialName) > -1) {
              return;
            }
            materialNames.push(materialName);
          });
        } else {
          materialNames.push(materialName);
        }
      });

    const creatables = highRarityItems.filter(item => {
      if(!item.getMaterials) {
        return false
      }
      const names = item.getMaterials().map(material => material.id);
      const nameMatched = names.filter(name => materialNames.indexOf(name) > -1)
      return names.length == nameMatched.length
    })

    areas[name] = creatables
  });

  return areas
}
export function findAll(conditions = {}, options = {}) {
  let found = dictItems
    .filter(itemArray => {
      const props = getItemProperties(itemArray);
      return getCondition(props, conditions);
    })
    .filter((itemArray, index) => {
      if (options.limit > 0 && options.offset > 0) {
        return index >= options.offset && index < options.offset + options.limit;
      } else if (options.limit > 0) {
        return index < options.limit;
      } else if (options.offset > 0) {
        return index >= options.offset;
      }
      return true;
    })
    .map(itemArray => new Item(itemArray));

  return found;
}
function getCondition(props, conditions = {}) {
  let { stats, type, typeSub, rarity, parents, children } = conditions;
  if (typeof stats === "string") {
    stats = new RegExp(stats);
  }
  if (typeof parents === "string") {
    parents = [parents];
  }
  if (typeof children === "string") {
    children = [children];
  }

  // 不合致したものにfalseを返す
  if (type != null && type !== props.type) {
    return false;
  }
  if (typeSub != null && typeSub !== props.typeSub) {
    return false;
  }
  if (typeof rarity === "number" && rarity !== props.rarity) {
    return false;
  }
  if (rarity != null && rarity.gte != null && rarity.gte > props.rarity) {
    return false;
  }
  if (stats instanceof RegExp && props.stats.match(stats) == null) {
    return false;
  }
  if (
    parents instanceof Array &&
    !parents.find(parent => {
      return props.parents.indexOf(String(parent).toLowerCase()) > -1;
    })
  ) {
    return false;
  }
  if (
    children instanceof Array &&
    !children.find(child => {
      return props.children.indexOf(String(child).toLowerCase()) > -1;
    })
  ) {
    return false;
  }
  if (children != null && children.gte != null && children.gte > props.children.length) {
    return false;
  }

  // 条件による絞込みが存在した場合は合致したものだけtrueとなる
  return true;
}

class Item {
  constructor(id, includeParents = true, includeChildren = true, includeArea = true) {
    let itemArray = id;
    if (typeof id === "string") {
      const key = String(id).toLowerCase();
      itemArray = dictItems.find(([name]) => name === key);
    }

    if (!itemArray) {
      return null;
    }

    const props = getItemProperties(itemArray);
    if (includeParents) {
      props.parents = props.parents.map(parent => new Item(parent, true, false));
    }
    if (includeChildren) {
      props.children = props.children.map(child => new Item(child, false, true));
    }

    if (includeArea) {
      dictAreas.forEach(area => {
        const [name, materials] = area;

        let amount = null;
        materials.forEach(([materialName, materialAmount]) => {
          if (materialName !== props.id) {
            return;
          }
          if (!materialAmount) {
            return;
          }
          amount = materialAmount;
        });

        const animals = getAnimals(props.id, name);
        if (amount != null || animals.length) {
          props.areas.push({ name, amount, animals });
        }
      });
    }

    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
  getSrc() {
    return `${imagepPrefixUrl}${this.src}`;
  }
  getSrcThumbnail() {
    return `${imagepPrefixUrl}${this.src}${imageSuffixUrl}`;
  }
  getMaterials() {
    const materials = [];

    this.children.forEach(child => {
      if (child.children && child.children.length) {
        child.getMaterials().forEach(child => {
          materials.push(child);
        });
        return;
      }

      materials.push(child);
    });

    return materials;
  }
}

// convert array values to object key-value
export function getItemProperties(itemArray) {
  let [id, src, details, parents, children] = itemArray;
  const [type, typeSub, rarity, stats, stackable, quantity] = details;
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
      id: getLocaleJa(id),
      type: getLocaleJa(type),
      typeSub: getLocaleJa(typeSub),
      stats: getLocaleJa(stats)
    }
  };
}
export function getAnimals(propId, areaName) {
  const animals = [];

  dictAnimals.forEach(animal => {
    const [animalName, drops, spawnTimer] = animal;
    drops.forEach(drop => {
      const [dropName, rate] = drop;
      if (dropName !== propId) {
        return;
      }

      dictAreas.forEach(area => {
        const [name, materials] = area;
        if (name !== areaName) {
          return;
        }
        materials.forEach(([materialName, count]) => {
          if (materialName !== animalName) {
            return;
          }
          if (!count) {
            return;
          }
          if (rate < 0.3) {
            // ドロップ率が稀のものをエリアの素材として扱わない
            return;
          }
          animals.push({ name: animalName, count, rate });
        });
      });
    });
  });

  return animals;
}
export function getLocaleJa(str) {
  if (str == null || !str) {
    return str;
  }
  const key = String(str).toLowerCase().replace(/_/g, " ");
  const locale = localeJa[key];
  if (locale == null) {
    // console;.log(`key "${key}" undefined in src/locales/ja.json`)
  }
  return locale || str;
}
export function toArray(strOrArray) {
  return strOrArray instanceof Array ? strOrArray : [strOrArray];
}
