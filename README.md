Eternal Return: Black Survival Item Finder
---
An *unofficial* synchronous item search library using information from [gamepedia](https://eternalreturn.gamepedia.com/).

Installation
---

```bash
yarn add bser-item-finder
yarn add esm

node -r esm
```

```js
import * as finder from "bser-item-finder";
console.log(finder.version) // 0.0.0
```

API
---

### `finder.find(id)` -> `Item` or `null`
### `finder.findById(id)` -> `Item` or `null`
Return one item that matches the specified `id`.

```js
finder.find("nope")
// null

finder.find("potato")
// Item {
//   id: 'potato',
//   src: 'c/c2/Potato.png',
//   type: 'consumables',
//   typeSub: 'food',
//   rarity: 1,
//   stats: 'hp regen + 130',
//   stackable: 5,
//   quantity: 2,
//   parents:
//    [ Item {
//        id: 'potato bread',
//        src: '2/26/Potato_Bread.png',
//        type: 'consumables',
//        typeSub: 'food',
//        rarity: 2,
//        stats: 'hp regen + 360',
//        stackable: 5,
//        quantity: 2,
//        parents: [],
//        children: [Array],
//        areas: [],
//        ja: [Object] },
//      Item {
//        id: 'potato soup',
//        src: 'a/ab/Potato_Soup.png',
//        type: 'consumables',
//        typeSub: 'food',
//        rarity: 2,
//        stats: 'hp regen + 600',
//        stackable: 5,
//        quantity: 1,
//        parents: [],
//        children: [Array],
//        areas: [],
//        ja: [Object] },
//      Item {
//        id: 'french fries',
//        src: '8/8e/French_Fries.png',
//        type: 'consumables',
//        typeSub: 'food',
//        rarity: 3,
//        stats: 'hp regen + 600',
//        stackable: 5,
//        quantity: 1,
//        parents: [Array],
//        children: [Array],
//        areas: [],
//        ja: [Object] },
//      Item {
//        id: 'baked potato',
//        src: '1/11/Baked_Potato.png',
//        type: 'consumables',
//        typeSub: 'food',
//        rarity: 3,
//        stats: 'hp regen + 600',
//        stackable: 5,
//        quantity: 2,
//        parents: [],
//        children: [Array],
//        areas: [],
//        ja: [Object] },
//      Item {
//        id: 'butter-fried potatoes',
//        src: '0/02/Butter-Fried_Potatoes.png',
//        type: 'consumables',
//        typeSub: 'food',
//        rarity: 3,
//        stats: 'hp regen + 650',
//        stackable: 5,
//        quantity: 2,
//        parents: [],
//        children: [Array],
//        areas: [],
//        ja: [Object] } ],
//   children: [],
//   areas:
//    [ { name: 'chapel', amount: 4, animals: [] },
//      { name: 'alley', amount: 4, animals: [] },
//      { name: 'temple', amount: 8, animals: [] } ],
//   ja:
//    { id: 'ジャガイモ',
//      type: '消耗品',
//      typeSub: 'しょくひん',
//      stats: 'hpリジェネ+130' } }
````

### `finder.findAll(conditions = {}, options = {})` => Array<Item>
### `finder.findOne(conditions = {}, options = {})` => Array<Item>
### `finder.findCreatableAreas(id, withOutMaterials = [])` => [[areaName, [[id, count], [...]]]]
### `finder.findCreatableHighRarityItems()` => Array<Item>
### `finder.findParents` => Array<Item>
### `finder.findChildren` => Array<Item>
> WIP

TODO
---
- dogfooding

License
---
MIT