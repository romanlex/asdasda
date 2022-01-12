import camelcase from 'camelcase'
import mapObj from 'map-obj'

export function camelcaseKeysDeep<T>(obj: T): T {
  // Any falsy, which includes `null` whose typeof is `object`.
  if (!obj) {
    return obj
  }
  // Date, whose typeof is `object` too.
  if (obj instanceof Date) {
    return obj
  }
  // Array, whose typeof is `object` too.
  if (Array.isArray(obj)) {
    return obj.map(function (element) {
      return camelcaseKeysDeep(element)
    }) as unknown as T
  }
  // So, if this is still an `object`, we might be interested in it.
  if (typeof obj === 'object') {
    return mapObj(obj, function (key, value) {
      const newKey = camelcase(String(key))
      if (key !== newKey && newKey in obj) {
        throw new Error('Camelcased key `' + newKey + '` would overwrite existing key of the given JSON object')
      }
      return [newKey, camelcaseKeysDeep(value)]
    }) as unknown as T
  }
  // Something else like a String or Number.
  return obj
}
