export default (mixinTarget, keys = []) => {
  return keys.reduce((mixinTarget, key) => {
    const symbol = Symbol(key)

    return class extends mixinTarget {
      [`set${key}`](value) {
        Object.defineProperty(this, symbol, { value, writable: true })
      }

      [`get${key}`]() {
        return this[symbol]
      }
    }
  }, mixinTarget)
}
