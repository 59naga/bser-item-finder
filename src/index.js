import dictItems from './dict/items'
import dictCharacters from './dict/characters'
import dictWeapons from './dict/weapons'
import dictAreas from './dict/areas'
import dictAnimals from './dict/animals'
import en from './locales/en'
import kr from './locales/kr'
import ja from './locales/ja'
import { Finder } from './finder'

export default new Finder([dictItems, dictCharacters, dictWeapons, dictAreas, dictAnimals], { en, kr, ja })
