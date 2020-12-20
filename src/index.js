import dictItems from "./dict/items.json";
import dictAreas from "./dict/areas.json";
import localeJa from "./locales/ja.json";

const imagepPrefixUrl =
  "https://static.wikia.nocookie.net/blacksurvivaleternalreturn_gamepedia_en/images/";
const imageSuffixUrl = "/revision/latest/scale-to-width-down/100";
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
export function findAll(conditions = {}, options = {}) {
  let found = dictItems
    .filter(itemArray => {
      const props = getItemProperties(itemArray);
      return getCondition(props, conditions);
    })
    .map(itemArray => new Item(itemArray));

  if (options.limit > 0 && options.offset > 0) {
    found = found.slice(~~options.offset, ~~options.offset + ~~options.limit);
  } else if (options.limit > 0) {
    found = found.slice(0, ~~options.limit);
  } else if (options.offset > 0) {
    found = found.slice(~~options.offset);
  }

  return found;
}
function getCondition(props, conditions) {
  if (conditions.type != null && conditions.type !== props.type) {
    return false;
  }
  if (conditions.typeSub != null && conditions.typeSub !== props.typeSub) {
    return false;
  }
  if (conditions.rarity != null && conditions.rarity !== props.rarity) {
    return false;
  }
  if (typeof conditions.stats === "string" && conditions.stats !== props.stats) {
    return false;
  }
  if (conditions.stats instanceof RegExp && props.stats.match(conditions.stats) == null) {
    return false;
  }
  return true;
}

class Item {
  constructor(id, includeParents = true, includeChildren = true) {
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

    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
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
    ja: {
      id: getLocaleJa(id),
      type: getLocaleJa(type),
      typeSub: getLocaleJa(typeSub),
      stats: getLocaleJa(stats)
    }
  };
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
