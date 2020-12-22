import localeJa from './locales/ja.json'
import { imagepPrefixUrl, imageSuffixUrl } from './constant'

export class Chara {
  static extractProperties(charaArray) {
    const [id, src, weapons] = charaArray
    return {
      id,
      src,
      weapons,
      ja: {
        id: localeJa[id],
      },
    }
  }

  constructor(charaArray) {
    const props = Chara.extractProperties(charaArray)
    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
  }

  getProps() {
    const { id, src, weapons } = this
    return { id, src, weapons }
  }

  getSrc() {
    return `${imagepPrefixUrl}${this.src}`
  }

  getSrcThumbnail(scale = 50) {
    return `${imagepPrefixUrl}${this.src}${imageSuffixUrl}${scale}`
  }
}
