import assert, { strictEqual, deepStrictEqual, throws } from 'assert'

import { createFinder } from '../src'
let finder
before(() => {
  finder = createFinder()
})
describe('Finder', () => {
  it('バージョン情報を返すべき', () => {
    assert(finder.version)
  })

  describe('Charas どのキャラのビルドか', () => {
    it('エマの使用武器を返すべき', () => {
      const emma = finder.findCharacterByName('emma')
      deepStrictEqual(emma.weapons, ['shuriken'])
    })
  })

  describe('Weapons ビルドを選択する前にファーストアイテムをピックする', () => {
    it('指定した武器種の情報を返すべき', () => {
      const weapon = finder.findWeaponByType('dual swords')
      deepStrictEqual(Object.values(weapon), ['dual swords', null, 'c/c6/WeaponDualSwords.png'])
    })
    it('初期装備の一覧を返すべき', () => {
      // TODO: 最初に持つアイテムと、最後に持っている武器種は必ずしも同じではない
      const weapons = finder.getFirstWeapons()
      deepStrictEqual(
        weapons.map((weapon) => weapon.id),
        [
          'kitchen knife',
          'hatchet',
          'rusty sword',
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
          'steel chain',
          'starter guitar',
        ]
      )
    })
    it('指定武器種と防具４種を、レアリティ順に並び替えて取得すべき', () => {
      const items = finder.findItems({
        where: { equipmentOnly: true, weaponThenOnly: 'dual swords' },
        order: ['weapon', 'type', 'rarity', 'index'],
        // TODO winrateやstatsの疑似合計値で並び替えできるようにする
      })
      const [weaponId] = items.map((item) => item.id)
      const [accessoryId] = items.filter((item) => item.type === 'accessory').map((item) => item.id)
      strictEqual(weaponId, 'dioscuri')
      strictEqual(accessoryId, 'emerald tablet')
    })
  })

  describe('Item 選択したアイテムについて、適切な情報を返すべき', () => {
    let fragarach
    before(() => {
      fragarach = finder.findById('Fragarach')
    })
    it('.getStats フラガラッハの性能を返すべき', () => {
      deepStrictEqual(fragarach.getStats(), { attack: 75, movementSpeed: 0.2 })
    })
    it('.getComponents フラガラッハを制作するための素材を返すべき', () => {
      deepStrictEqual(
        fragarach.getComponents().map((item) => item.id),
        ['kitchen knife', 'branch', 'tree of life', 'stone', 'meteorite']
      )
    })
    it('.getChildEquipments フラガラッハを制作するための中間装備を返すべき', () => {
      deepStrictEqual(
        fragarach.getChildEquipments().map((item) => item.id),
        ['army knife', 'force core', 'powder of life']
      )
    })
    it('.getTree / ::traverseTreeItems アイテムツリーを返すべき', () => {
      const tree = fragarach.getTree()
      const Item = fragarach.constructor
      const treeOnlyId = Item.traverseTreeItems(tree, (item) => item.id)
      deepStrictEqual(treeOnlyId, [
        ['army knife', ['kitchen knife', 'branch']],
        ['force core', [['powder of life', ['tree of life', 'stone']], 'meteorite']],
      ])
    })
    it('.getParents 派生先アイテムを取得する', () => {
      const branchParents = finder
        .findById('branch')
        .getParents()
        .map((item) => item.id)
      deepStrictEqual(branchParents, [
        'circlet',
        'military suit',
        'butter',
        'army knife',
        'tonfa',
        'willow leaf spike',
        'wooden bow',
        'mistilteinn',
      ])
    })
  })

  describe('Build 選択したアイテム郡をビルドとする', () => {
    let build
    before(() => {
      build = finder.createBuild()
    })
    it('.addItem ビルドにアイテムを追加する', () => {
      build.addItem('Fragarach')
      deepStrictEqual(
        build.getItems().map((item) => item.id),
        ['fragarach']
      )
    })
    it('.removeItemByIndex 指定した位置のアイテムを削除する', () => {
      build.removeItemByIndex(0)
      strictEqual(build.getItems().length, 0)
    })

    it('.addArea 巡回するエリアを追加する', () => {
      build.addArea('beach')
      deepStrictEqual(
        build.getAreas().map((item) => item.name),
        ['beach']
      )
    })
    it('.removeArea 巡回するエリアを削除する', () => {
      build.removeArea('beach')
      strictEqual(build.getAreas().length, 0)
    })

    it('.countMaterials ビルドに必要な素材個数を返すべき', () => {
      const build = finder.createBuild(['motorcycle helmet', 'motorcycle helmet'], ['beach'])
      const materials = build.countMaterials()
      const count = materials.map((material) => [material.id, material.getCount()])
      deepStrictEqual(count, [
        ['bike helmet', 2],
        ['stone', 2],
        ['water', 2],
        ['binoculars', 2],
      ])
    })

    it('.getProgresses バイクヘルメットがビーチだけで作成できることを返すべき', () => {
      const build = finder.createBuild(['motorcycle helmet', "rocker's jacket"], ['beach', 'hotel'])
      const progresses = build.getProgresses(['kitchen knife', ['bread', 2], ['water', 2]])

      const itemPerAreas = progresses.map(([name, progress]) => progress.map((item) => (item ? item.id : item)))
      deepStrictEqual(itemPerAreas, [
        ['motorcycle helmet', null],
        ['motorcycle helmet', 'rider jacket'],
      ])
    })
    it('.getProgresses 巡回するエリアごとにビルドの進捗を返すべき', () => {
      const build = finder.createBuild(
        ['fragarach', 'laurel wreath', 'kabana', 'bracelet of skadi', 'boots of hermes', 'emerald tablet'],
        ['beach', 'uptown', 'dock', 'hotel', 'archery range']
      )
      const progresses = build.getProgresses(['kitchen knife', ['bread', 2], ['water', 2]])
      const itemPerAreas = progresses.map(([name, progress]) => progress.map((item) => (item ? item.id : item)))
      deepStrictEqual(itemPerAreas, [
        ['army knife', null, null, null, null, null],
        ['army knife', null, null, 'crimson bracelet', 'running shoes', 'flower'],
        ['army knife', null, null, 'crimson bracelet', 'running shoes', 'flower'],
        // FIXME: should be count for actual number of materials
        ['fragarach', null, null, 'bracelet of skadi', 'running shoes', 'emerald tablet'],
        ['fragarach', null, 'kabana', 'bracelet of skadi', 'boots of hermes', 'emerald tablet'],
      ])
    })
    it('.calcTotalStats 選択した装備の合計スタッツを返すべき', () => {
      const build = finder.createBuild(["rocker's jacket", 'sword stopper', 'white rhinos', 'white crane fan'])
      const total = build.calcTotalStats()
      deepStrictEqual(total, [
        {
          hpRegen: 0.7,
          attack: 30,
          attackSpeed: 15,
          skillDamage: 16,
          defense: 37,
          defenseAttack: 26,
          movementSpeed: 0.45,
          movementSpeedNotCombat: 0.2,
        },
        [{ healingReductionSkill: 40 }, { healingReductionAttack: 40 }, { healingReductionAttack: 40 }, { healingReductionSkill: 40 }],
      ])
    })
  })
})

describe('I18n', () => {
  let finder
  before(() => {
    finder = createFinder()
    finder.setLang('ja')
  })

  it('.setLang expect throw when set unavailable languages', () => {
    throws(() => finder.setLang('アルベド語'), { message: /Cannot change language/ })
  })
  it('.__ expect translate beach to ja from en', () => {
    strictEqual(finder.__('beach'), '浜辺')
  })
  it('.setLocales expect be set translation', () => {
    finder.setLocales({
      en: {
        build: 'Build',
      },
      kr: {
        build: '짓다',
      },
      ja: {
        build: 'ビルド',
      },
    })

    strictEqual(finder.__('build', 'アルベド語'), 'Build')
    strictEqual(finder.__('build', 'kr'), '짓다')
    strictEqual(finder.__('build'), 'ビルド')

    finder.setLocales({
      ja: { beach: '海の家' },
    })
    strictEqual(finder.__('beach'), '海の家')
  })
})
