import { strictEqual, deepStrictEqual } from 'assert'

import * as finder from '../src'
export { version } from '../package'
it('バージョンを返すべき', () => {
  strictEqual(finder.version.version)
})
it('アイテム種をすべて返すべき', () => {
  deepStrictEqual(finder.getTypes(), [
    'food',
    'beverage',
    'head',
    'chest',
    'arm',
    'leg',
    'accessory',
    'dagger',
    'two-handed sword',
    'axe',
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
    'head',
    'nunchaku',
    'whip',
    'material',
    'summon',
  ])
})
it('キャラごとの装備可能な武器種を返すべき', () => {
  deepStrictEqual(
    finder.getCharacters().map((chara) => chara.getProps()),
    [
      { id: 'adriana', src: '6/6f/Adriana_Mini.png', weapons: ['throw'] },
      { id: 'aya', src: '2/22/Aya_Mini.png', weapons: ['pistol', 'assault rifle', 'sniper'] },
      { id: 'chiara', src: '9/98/Chiara_Mini.png', weapons: ['rapier'] },
      { id: 'fiora', src: 'a/a6/Fiora_Mini.png', weapons: ['rapier', 'spear', 'two-handed sword'] },
      { id: 'hart', src: 'a/ab/Hart_Mini.png', weapons: ['guitar'] },
      { id: 'hyejin', src: '4/4c/Hyejin_Mini.png', weapons: ['bow', 'shuriken'] },
      { id: 'hyunwoo', src: '8/85/Hyunwoo_Mini.png', weapons: ['glove', 'tonfa'] },
      { id: 'isol', src: '0/06/Isol_Mini.png', weapons: ['assault rifle', 'pistol'] },
      { id: 'jackie', src: 'd/d5/Jackie_Mini.png', weapons: ['dagger', 'two-handed sword', 'axe', 'dual swords'] },
      { id: 'li_dailin', src: '8/87/Li_Dailin_Mini.png', weapons: ['glove', 'nunchaku'] },
      { id: 'magnus', src: '8/87/Magnus_Mini.png', weapons: ['hammer', 'bat'] },
      { id: 'nadine', src: 'a/a9/Nadine_Mini.png', weapons: ['bow', 'crossbow'] },
      { id: 'shoichi', src: '8/82/Shoichi_Mini.png', weapons: ['dagger'] },
      { id: 'silvia', src: '4/4d/Silvia_Mini.png', weapons: ['pistol'] },
      { id: 'sissela', src: 'd/dc/Sissela_Mini.png', weapons: ['shuriken', 'throw'] },
      { id: 'xiukai', src: '9/99/Xiukai_Mini.png', weapons: ['spear', 'dagger'] },
      { id: 'yuki', src: '8/87/Yuki_Mini.png', weapons: ['two-handed sword', 'dual swords'] },
      { id: 'zahir', src: '4/4c/Zahir_Mini.png', weapons: ['throw', 'shuriken'] },
    ]
  )
})

it('すべての両手剣を検索', () => {
  const found = finder.findAll({ type: 'two-handed sword' })
  strictEqual(found.length, 15)
})

it('ジャガイモの情報と子孫のツリー情報を返すべき', () => {
  const item = finder.find('Potato')
  deepStrictEqual(
    item.parents.map((parent) => parent.id),
    ['potato bread', 'potato soup', 'french fries', 'baked potato', 'butter-fried potatoes']
  )
})

it('致命を検索', () => {
  const found = finder.findAll({ stats: /healing reduction/ })
  deepStrictEqual(
    found.map((item) => item.id),
    [
      "rocker's jacket",
      'sword stopper',
      'white rhinos',
      'gilded quill fan',
      'white crane fan',
      'harpe',
      'divine dual swords',
      'fangtian huaji',
      'goblin bat',
      'mallet',
      'spiky bouncy ball',
      'ruthenium marble',
      'composite bow',
      'twinbow',
      'elemental bow',
      'sharper',
      'the smiting dragon',
    ]
  )
})

it('皮の入手場所を返すべき(30%以上)', () => {
  const item = finder.find('leather')
  deepStrictEqual(
    item.areas.map((area) => area.name),
    [
      'beach',
      'uptown',
      'dock',
      'hotel',
      'archery range',
      'school',
      'forest',
      'chapel',
      'cemetery',
      'factory',
      'alley',
      'avenue',
      'pond',
      'hospital',
      'temple',
    ]
  )
})

it('パウンドケーキが作成できるエリアを返すべき', () => {
  const found = finder.findCreatableAreas('pound cake', ['water', 'bread'])
  deepStrictEqual(found, [
    [
      'chapel',
      [
        ['milk', 3],
        ['branch', 5],
      ],
    ],
    [
      'avenue',
      [
        ['milk', 6],
        ['branch', 4],
      ],
    ],
    [
      'hospital',
      [
        ['milk', 5],
        ['branch', 4],
      ],
    ],
  ])
})
it('ガントレットが作成できるエリアを返すべき(手袋無視)', () => {
  const found = finder.findCreatableAreas('gauntlet', 'cotton glove')
  deepStrictEqual(found, [
    [
      'hotel',
      [
        ['scrap metal', 8],
        ['iron ore', 7],
      ],
    ],
  ])
})

it('エリア単体で作成可能な上位アイテムを返すべき（ただし武器はピストル種のみ）', () => {
  const found = finder.findCreatableHighRarityItems({ weaponThenOnly: 'pistol' })
  deepStrictEqual(
    found.beach.map((item) => item.id),
    ['canned cod liver', 'safety helmet', 'leather shield', 'beretta m92f', 'gold', 'ruby', 'telephoto camera']
  )
})

it('パン派生で作れるもの一覧を返すべき', () => {
  const found = finder.findParents('Bread')
  const recipes = found.map((item) => {
    const list = [item.id]
    item.children.forEach((child) => {
      list.push([
        child.id,
        ...child.areas.map(({ name, amount, animals }) => {
          return [
            name,
            amount ||
              animals.map(({ name, count, rate }) => {
                return [name, count, rate]
              }),
          ]
        }),
      ])
    })
    return list
  })
  deepStrictEqual(recipes, [
    ['garlic bread', ['garlic', ['cemetery', 5], ['alley', 6], ['temple', 6]]],
    ['bungeoppang', ['carp', ['forest', 2], ['cemetery', 2], ['pond', 9]]],
    ['choco pie', ['chocolate', ['uptown', 5], ['archery range', 4], ['avenue', 6]]],
    ['bun', ['coffee', ['uptown', 5], ['dock', 6], ['cemetery', 5]]],
    [
      'hamburger',
      [
        'meat',
        [
          'beach',
          [
            ['bear', 3, 1],
            ['boar', 3, 1],
          ],
        ],
        [
          'uptown',
          [
            ['bear', 2, 1],
            ['chicken', 5, 0.5],
          ],
        ],
        [
          'dock',
          [
            ['bear', 3, 1],
            ['chicken', 4, 0.5],
          ],
        ],
        [
          'hotel',
          [
            ['chicken', 3, 0.5],
            ['wolf', 4, 1],
          ],
        ],
        [
          'archery range',
          [
            ['boar', 3, 1],
            ['wolf', 4, 1],
          ],
        ],
        ['school', [['chicken', 6, 0.5]]],
        [
          'forest',
          [
            ['boar', 4, 1],
            ['wolf', 2, 1],
          ],
        ],
        [
          'chapel',
          [
            ['boar', 3, 1],
            ['chicken', 6, 0.5],
          ],
        ],
        [
          'cemetery',
          [
            ['boar', 4, 1],
            ['wolf', 2, 1],
          ],
        ],
        [
          'factory',
          [
            ['chicken', 3, 0.5],
            ['wolf', 4, 1],
          ],
        ],
        [
          'alley',
          [
            ['bear', 3, 1],
            ['chicken', 8, 0.5],
            ['wolf', 4, 1],
          ],
        ],
        [
          'avenue',
          [
            ['boar', 6, 1],
            ['chicken', 5, 0.5],
          ],
        ],
        [
          'pond',
          [
            ['bear', 2, 1],
            ['boar', 4, 1],
          ],
        ],
        [
          'hospital',
          [
            ['chicken', 3, 0.5],
            ['wolf', 4, 1],
          ],
        ],
        [
          'temple',
          [
            ['bear', 2, 1],
            ['boar', 3, 1],
          ],
        ],
      ],
    ],
    ['potato bread', ['potato', ['chapel', 4], ['alley', 4], ['temple', 8]]],
    ['citrus cake', ['lemon', ['uptown', 5], ['hotel', 6], ['hospital', 4]]],
    ['egg bun', ['egg', ['archery range', 5], ['forest', 6], ['cemetery', 5]]],
    ['curry bun', ['curry powder', ['uptown', 5], ['factory', 5]]],
    ['mocha bread', ['coffee liqueur']],
    ['pound cake', ['butter']],
    ['carp bread', ['carp', ['forest', 2], ['cemetery', 2], ['pond', 9]]],
  ])
})
