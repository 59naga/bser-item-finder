import fs from 'fs'

import finder from '../../src'
it.skip('convert bs_localization to i18n locale files', () => {
  const keys = []
  finder.findCharacters().forEach((item) => {
    keys.push(item.name)
  })
  finder.findWeapons().forEach((item) => {
    keys.push(item.type)
  })
  finder.findAreas().forEach((item) => {
    keys.push(item.name)
  })
  finder.findAnimals().forEach((item) => {
    keys.push(item.name)
  })
  finder.findItems().forEach((item) => {
    keys.push(item.id)
  })
  ;[
    'hp',
    'hpRegen',
    'hpRegenIncrease',
    'sp',
    'spRegen',
    'spRegenIncrease',
    'attack',
    'attackSpeed',
    'attackExtraDamage',
    'attackRange',
    'skillDamage',
    'skillCooldown',
    'lifeSteal',
    'criticalDamage',
    'criticalChance',
    'defense',
    'defenseAttack',
    'defenseSkill',
    'movementSpeed',
    'movementSpeedNotCombat',
    'healingReductionAttack',
    'healingReductionSkill',
    'visionRange',
    'maxAmmo',
    'trapDamage',
  ].forEach((key) => {
    keys.push(key)
  })

  const locales = {
    en: {},
    kr: {},
    ja: {},
  }
  keys.forEach((key) => {
    locales.en[key] = ''
    locales.kr[key] = ''
    locales.ja[key] = ''
  })

  const lines = fs
    .readFileSync('./test/legacy/bs_localization_2055_170143', 'utf8')
    .split('\n')
    .concat(fs.readFileSync('./test/legacy/bs_localization_2048_150526', 'utf8').split('\n'))
  lines.forEach((line) => {
    const cells = line.split('┃')
    const [, kr, en, ja] = cells
    if (!en) {
      return
    }

    const id = en.toLowerCase()
    if (keys.indexOf(id) === -1) {
      return
    }

    locales.en[id] = en
    locales.kr[id] = kr
    locales.ja[id] = ja
  })

  Object.entries(require('./statsLocales')).forEach(([key, locale]) => {
    const { en, kr, ja } = locale
    locales.en[key] = en
    locales.kr[key] = kr
    locales.ja[key] = ja
  })

  Object.keys(locales).forEach((key) => {
    fs.writeFileSync(`./src/locales/${key}.json`, JSON.stringify(locales[key], null, 2))
  })
})
