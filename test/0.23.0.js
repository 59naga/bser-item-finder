import { strictEqual, deepStrictEqual } from 'assert'

import { createFinder } from '../src'
describe.skip('expect applied 0.23.0 patch buff/nerf stats', () => {
  const finder = createFinder()
  finder.setLang('ja')

  it('', () => {
    strictEqual(finder.patch, '0.23.0')
  })
  it('weapons', () => {
    const whips = finder.findItems({ where: { type: 'whip' } }).map((item) => [finder.__(item.id), item.getStats()])
    deepStrictEqual(whips, [
      ['鞭', { attack: 12 }],
      ['お縄', { attack: 24, skillDamage: 6 }],
      ['鉄鞭', { attack: 30 }],
      ['風の鞭', { attack: 24, skillDamage: 20 }],
      ['雷龍鞭', { attack: 30, skillDamage: 20 }],
      ['霹靂鞭', { attack: 42, attackSpeed: 20 }],
      ['グレイプニル', { attack: 58, skillDamage: 35 }],
      ['プラズマ鞭', { attack: 54, attackSpeed: 30, visionRange: 2.3 }],
      ['血花九節鞭', { attack: 65, skillDamage: 40, lifeSteal: 20 }],
    ])

    deepStrictEqual(
      finder
        .findById('starter guitar')
        .getChildren()
        .map((item) => item.id),
      ['bamboo', 'piano wire']
    )
    strictEqual(finder.findById('stairway to heaven').getStats().attack, 56)
    strictEqual(finder.findById('wonderful tonight').getStats().attackSpeed, 18)
    deepStrictEqual(finder.findById('mount slicer').getStats(), { attack: 38, skillDamage: 30, skillCooldown: 10, movementSpeed: 0.1 })
    strictEqual(finder.findById('fragarach').getStats().attack, 90)
    strictEqual(finder.findById('harpe').getStats().skillDamage, 33)
    strictEqual(finder.findById('bastard sword').getStats().movementSpeed, -0.05)
    strictEqual(finder.findById('thuan thien').getStats().movementSpeed, -0.05)
    strictEqual(finder.findById('monohoshizao').getStats().attack, 74)
    strictEqual(finder.findById('dainsleif').getStats().attack, 80)
    strictEqual(finder.findById('long rifle').getStats().movementSpeed, undefined)
    strictEqual(finder.findById('springfield').getStats().movementSpeed, -0.07)
    strictEqual(finder.findById('ntw-20').getStats().movementSpeed, -0.07)
    strictEqual(finder.findById('the deadly ray').getStats().movementSpeed, -0.07)
    strictEqual(finder.findById('golden rifle').getStats().movementSpeed, -0.07)
    strictEqual(finder.findById('railgun').getStats().movementSpeed, -0.03)
    strictEqual(finder.findById('tac-50').getStats().movementSpeed, undefined)
    strictEqual(finder.findById('polaris').getStats().movementSpeed, -0.03)
    strictEqual(finder.findById('intervention').getStats().attack, 115)
    strictEqual(finder.findById('fangtian huaji').getStats().skillDamage, 31)
    strictEqual(finder.findById('lance of poseidon').getStats().movementSpeed, undefined)
    strictEqual(finder.findById('dragon guandao').getStats().movementSpeed, -0.05)
    strictEqual(finder.findById('tactical tonfa').getStats().attack, 74)
    strictEqual(finder.findById('mai sok').getStats().attack, 54)
    strictEqual(finder.findById("david's sling").getStats().attack, 75)
    deepStrictEqual(finder.findById('hammer of dagda').getStats(), {
      attack: 95,
      attackExtraDamage: 20,
      hpRegenIncrease: 150,
    })
  })

  it('armors', () => {
    strictEqual(finder.findById("commander's armor").getStats().skillDamage, 18)
    strictEqual(finder.findById('kabana').getStats().skillDamage, 20)
    strictEqual(finder.findById("rocker's jacket").getStats().defenseAttack, 11)
    strictEqual(finder.findById('imperial burgonet').getStats().skillDamage, 18)
    strictEqual(finder.findById('sword of shah jahan').getStats().attack, 25)
    strictEqual(finder.findById('sword stopper').getStats().defense, 32)
    deepStrictEqual(finder.findById('steel shield').getStats(), {
      attack: 23,
      defense: 20,
      movementSpeed: -0.05,
    })
    deepStrictEqual(finder.findById('creed of the knight').getStats(), {
      attack: 30,
      criticalDamage: 20,
      defense: 20,
      hpRegen: 1.5,
      movementSpeed: -0.05,
    })
    strictEqual(finder.findById('radar').getStats().attackSpeed, 40)
    strictEqual(finder.findById('feather boots').getStats().attackSpeed, 35)
    strictEqual(finder.findById('laced quiver').getStats().attackSpeed, 30)
    strictEqual(finder.findById('revenge of goujian').getStats().skillDamage, 20)
  })
})
