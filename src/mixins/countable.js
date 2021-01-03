// https://stackoverflow.com/a/35925061/2969618
// eg: "Animal extends mixinCountable(FinderClass)" => animal.getCount() / animal.setCount() can be access
export default (mixinTarget, keys = ['Count']) => {
  return keys.reduce((mixinTarget, key) => {
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
  }, mixinTarget)
}
