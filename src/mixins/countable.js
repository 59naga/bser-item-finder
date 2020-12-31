// https://stackoverflow.com/a/35925061/2969618
export default (mixinTarget, key = 'Count') => {
  const symbol = Symbol(key)

  return class extends mixinTarget {
    [`set${key}`](value) {
      Object.defineProperty(this, symbol, { value, writable: true })
    }

    [`up${key}`]() {
      let value = this[symbol]
      if (value == null) {
        value = 0
      }
      Object.defineProperty(this, symbol, { value: value + 1, writable: true })
    }

    [`get${key}`]() {
      return this[symbol]
    }
  }
}
