import fs from 'fs'

import dictItems from '../../src/dict/items'
import dictWeapons from '../../src/dict/weapons'
import dictAreas from '../../src/dict/areas'
import dictAnimals from '../../src/dict/animals'
import { Finder } from '../../src/finder'

const finder = new Finder(dictItems, dictWeapons, dictAreas, dictAnimals)

it.skip('convert bs_localization to i18n locale files', () => {
  const keys = []
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

  const lines = fs.readFileSync('./test/legacy/bs_localization_2055_170143', 'utf8').split('\n')
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

  Object.keys(locales).forEach((key) => {
    fs.writeFileSync(`./src/locales/${key}.json`, JSON.stringify(locales[key], null, 2))
  })
})
