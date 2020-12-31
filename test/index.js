import assert, { strictEqual, deepStrictEqual, throws } from 'assert'

import finder from '../src'
describe('Finder', () => {
  it('バージョン情報を返すべき', () => {
    assert(finder.version)
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
  })

  describe('Item 選択したアイテムについて、適切な情報を返すべき', () => {
    const fragarach = finder.findById('Fragarach')
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
    it('.getComponentOrigins フラガラッハを制作するための素材が存在するエリア、およびその個数を返すべき', () => {
      const origins = fragarach.getComponentOrigins('kitchen knife')
      deepStrictEqual(origins, {
        beach: [
          { id: 'branch', count: 5, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 3 }] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'bear', rate: 0.06, count: 3 }] },
        ],
        uptown: [
          { id: 'branch', count: 6, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 2 }] },
          { id: 'stone', count: 5, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'bear', rate: 0.06, count: 2 }] },
        ],
        dock: [
          { id: 'branch', count: 7, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 3 }] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'bear', rate: 0.06, count: 3 }] },
        ],
        hotel: [
          { id: 'branch', count: 5, animals: [] },
          { id: 'tree of life', count: 1, animals: [] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 4 }] },
        ],
        'archery range': [
          { id: 'branch', count: 4, animals: [] },
          { id: 'stone', count: 2, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 4 }] },
        ],
        school: [
          { id: 'branch', count: 6, animals: [] },
          { id: 'stone', count: 5, animals: [] },
        ],
        forest: [
          { id: 'branch', count: 13, animals: [] },
          { id: 'tree of life', count: 1, animals: [] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 2 }] },
        ],
        chapel: [
          { id: 'branch', count: 5, animals: [] },
          { id: 'stone', count: 2, animals: [] },
        ],
        cemetery: [
          { id: 'branch', count: 6, animals: [] },
          { id: 'tree of life', count: 1, animals: [] },
          { id: 'stone', count: 2, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 2 }] },
        ],
        factory: [
          { id: 'branch', count: 7, animals: [] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 4 }] },
        ],
        alley: [
          { id: 'branch', count: 5, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 3 }] },
          { id: 'stone', count: 3, animals: [] },
          {
            id: 'meteorite',
            count: 0,
            animals: [
              { name: 'wolf', rate: 0.053, count: 4 },
              { name: 'bear', rate: 0.06, count: 3 },
            ],
          },
        ],
        avenue: [
          { id: 'branch', count: 4, animals: [] },
          { id: 'stone', count: 1, animals: [] },
        ],
        pond: [
          { id: 'branch', count: 6, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 2 }] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'bear', rate: 0.06, count: 2 }] },
        ],
        hospital: [
          { id: 'branch', count: 4, animals: [] },
          { id: 'stone', count: 2, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'wolf', rate: 0.053, count: 4 }] },
        ],
        temple: [
          { id: 'branch', count: 5, animals: [] },
          { id: 'tree of life', count: 0, animals: [{ name: 'bear', rate: 0.02, count: 2 }] },
          { id: 'stone', count: 3, animals: [] },
          { id: 'meteorite', count: 0, animals: [{ name: 'bear', rate: 0.06, count: 2 }] },
        ],
      })
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

    describe('.misc 上記仕様を実現するためのユーティリティ関数群', () => {
      describe('.countPerAreas エリアごとの、素材の在庫、関連する動物の頭数とドロップ率を返すべき', () => {
        it('枝の個数', () => {
          const areas = finder.countPerAreas('branch')
          deepStrictEqual(areas, [
            { name: 'beach', count: 5, animals: [] },
            { name: 'uptown', count: 6, animals: [] },
            { name: 'dock', count: 7, animals: [] },
            { name: 'hotel', count: 5, animals: [] },
            { name: 'archery range', count: 4, animals: [] },
            { name: 'school', count: 6, animals: [] },
            { name: 'forest', count: 13, animals: [] },
            { name: 'chapel', count: 5, animals: [] },
            { name: 'cemetery', count: 6, animals: [] },
            { name: 'factory', count: 7, animals: [] },
            { name: 'alley', count: 5, animals: [] },
            { name: 'avenue', count: 4, animals: [] },
            { name: 'pond', count: 6, animals: [] },
            { name: 'hospital', count: 4, animals: [] },
            { name: 'temple', count: 5, animals: [] },
          ])
        })
        it('隕石の個数', () => {
          const areas = finder.countPerAreas('meteorite')
          deepStrictEqual(areas, [
            {
              name: 'beach',
              count: 0,
              animals: [
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 3,
                },
              ],
            },
            {
              name: 'uptown',
              count: 0,
              animals: [
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 2,
                },
              ],
            },
            {
              name: 'dock',
              count: 0,
              animals: [
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 3,
                },
              ],
            },
            {
              name: 'hotel',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 4,
                },
              ],
            },
            {
              name: 'archery range',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 4,
                },
              ],
            },
            {
              name: 'forest',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 2,
                },
              ],
            },
            {
              name: 'cemetery',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 2,
                },
              ],
            },
            {
              name: 'factory',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 4,
                },
              ],
            },
            {
              name: 'alley',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 4,
                },
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 3,
                },
              ],
            },
            {
              name: 'pond',
              count: 0,
              animals: [
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 2,
                },
              ],
            },
            {
              name: 'hospital',
              count: 0,
              animals: [
                {
                  name: 'wolf',
                  rate: 0.053,
                  count: 4,
                },
              ],
            },
            {
              name: 'temple',
              count: 0,
              animals: [
                {
                  name: 'bear',
                  rate: 0.06,
                  count: 2,
                },
              ],
            },
          ])
        })
      })
    })
  })

  describe('Build 選択したアイテム郡をビルドとする', () => {
    const build = finder.createBuild()
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

      const itemPerAreas = progresses.map((progress) => progress.map((item) => (item ? item.id : item)))
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
      const itemPerAreas = progresses.map((progress) => progress.map((item) => (item ? item.id : item)))
      deepStrictEqual(itemPerAreas, [
        ['army knife', null, null, null, null, null],
        ['army knife', null, null, 'crimson bracelet', 'running shoes', 'flower'],
        ['army knife', null, null, 'crimson bracelet', 'running shoes', 'flower'],
        // FIXME: should be count for actual number of materials
        ['fragarach', null, null, 'bracelet of skadi', 'running shoes', 'emerald tablet'],
        ['fragarach', null, 'kabana', 'bracelet of skadi', 'boots of hermes', 'emerald tablet'],
      ])
    })
  })
})

describe('I18n', () => {
  it('.setLang expect throw when set unavailable languages', () => {
    throws(() => finder.setLang('アルベド語'), { message: /Cannot change language/ })
  })
  it('.__ expect translate beach to ja from en', () => {
    finder.setLang('ja')
    strictEqual(finder.__('beach'), '浜辺')
  })
})
