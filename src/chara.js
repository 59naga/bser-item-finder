import { imagepPrefixUrl, imageSuffixUrl } from './constant'

export class Chara {
  // convert array values to object key-value
  static extractProperties(charaArray) {
    const [name, src, weapons] = charaArray
    return { name, src, weapons }
  }

  constructor(charaArray) {
    const props = Chara.extractProperties(charaArray)
    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
  }

  getSrc() {
    return `${imagepPrefixUrl}${this.src}`
  }

  getSrcThumbnail(scale = 50) {
    return `${imagepPrefixUrl}${this.src}${imageSuffixUrl}${scale}`
  }

  getProps() {
    const { name, src, weapons } = this
    return { name, src, weapons }
  }
}
