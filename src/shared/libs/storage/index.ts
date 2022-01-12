/* @copyright https://github.com/RonenNess/ExpiredStorage */
import { isSupported, MemoryStorage } from 'local-storage-fallback'
import Logger from 'services/logger'

class ExpiredStorage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _storage: Storage | (Pick<Storage, 'clear' | 'getItem' | 'setItem' | 'removeItem'> & { [key: string]: any })

  _expiration_key_prefix: string

  /**
   * @param storageToUse: object with methods setItem, getItem, removeItem, clear
   */
  constructor(storageToUse: Storage | Pick<Storage, 'clear' | 'getItem' | 'setItem' | 'removeItem'>) {
    this._storage = storageToUse
    // prefix to use when storing items timestamp
    this._expiration_key_prefix = '__expired_storage_ts__'
  }

  /**
   * Get current timestamp in seconds.
   * */
  getTimestamp: () => number = () => Math.floor(new Date().getTime() / 1000)

  /**
   * Set item.
   * @param key: Item key to set (string).
   * @param value: Value to store (string).
   * @param expiration: Expiration time, in seconds. If not provided, will not set expiration time.
   * @param return: Storage.setItem() return code.
   * */
  setItem(key: string, value: string, expiration?: number): void | string {
    // set item
    const ret = this._storage.setItem(key, value)

    // set expiration timestamp (only if defined)
    if (expiration !== null && expiration !== undefined && expiration > 0) {
      this.updateExpiration(key, expiration)
    }

    // return set value return value
    return ret
  }

  /**
   * Get item.
   * @param key: Item key to get (string).
   * @return: Stored value, or undefined if not set / expired.
   */
  getItem(key: string): string | null {
    // if expired remove item and return null
    if (this.isExpired(key)) {
      this.removeItem(key)

      return null
    }

    // try to fetch and return item value
    return this._storage.getItem(key)
  }

  /**
   * Get item + metadata such as time left and if expired.
   * Even if item expired, will not remove it.
   * @param key: Item key to get (string).
   * @return: Dictionary with: {value, timeLeft, isExpired}
   */
  peek(key: string): { isExpired: boolean; timeLeft: null | number; value: string | null } {
    // get value and time left
    const ret = {
      isExpired: false,
      timeLeft: this.getTimeLeft(key),
      value: this._storage.getItem(key),
    }

    // set if expired
    ret.isExpired = ret.timeLeft !== null && ret.timeLeft <= 0

    // return data
    return ret
  }

  /**
   * Get item time left to live.
   * @param key: Item key to get (string).
   * @return: Time left to expire (in seconds), or null if don't have expiration date.
   */
  getTimeLeft(key: string): null | number {
    // try to fetch expiration time for key
    const val = this._storage.getItem(this._expiration_key_prefix + key)
    const expireTime = val ? parseInt(val) : 0

    // if got expiration time return how much left to live
    if (expireTime > 0 && !isNaN(expireTime)) {
      return expireTime - this.getTimestamp()
    }

    // if don't have expiration time return null
    return null
  }

  /**
   * Return if an item is expired (don't remove it, even if expired).
   * @param key: Item key to check (string).
   * @return: True if expired, False otherwise.
   */
  isExpired(key: string): boolean {
    // get time left for item
    const timeLeft = this.getTimeLeft(key)

    // return if expired
    return timeLeft !== null && timeLeft <= 0
  }

  /**
   * Update expiration time for an item (note: doesn't validate that the item is set).
   * @param key: Item key to update expiration for (string).
   * @param expiration: New expiration time in seconds to set.
   * @return: Storage.setItem() return code for setting new expiration.
   * */
  updateExpiration(key: string, expiration: number): void | string {
    return this._storage.setItem(this._expiration_key_prefix + key, `${this.getTimestamp() + expiration}`)
  }

  /**
   * Remove an item.
   * @param key: Item key to remove (string).
   * @return: Storage.removeItem() return code.
   */
  removeItem(key: string): void {
    // remove the item itself and its expiration time
    const ret = this._storage.removeItem(key)

    this._storage.removeItem(this._expiration_key_prefix + key)

    // return optional return code
    return ret
  }

  /**
   * Get all keys in storage, not including internal keys used to store expiration.
   * @param: includeExpired: if true, will also include expired keys.
   * @return: Array with keys.
   */
  keys(includeExpired: boolean): Array<string> {
    // create list to return
    const ret: string[] = []

    this._iterKeys((storageKey) => {
      // if its not a timestamp key, skip it
      if (storageKey !== null && storageKey !== undefined && storageKey.indexOf(this._expiration_key_prefix) !== 0) {
        // add to return list, but only if including expired keys or if not expired yet
        if (includeExpired || !this.isExpired(storageKey)) {
          ret.push(storageKey)
        }
      }
    })

    // return keys
    return ret
  }

  /**
   * Iterate all keys in storage class.
   * @param callback to call for every key, with a single param: key.
   */
  _iterKeys(callback: (_key: string) => void) {
    // first check if storage define a 'keys()' function. if it does, use it
    if (typeof this._storage.keys === 'function') {
      const keys = this._storage.keys()

      for (let i = 0; i < keys.length; ++i) {
        callback(keys[i])
      }
    } else if (typeof Object === 'function' && Object.keys) {
      // if not supported try to use object.keys
      const keys = Object.keys(this._storage)

      for (let i = 0; i < keys.length; ++i) {
        callback(keys[i])
      }
    } else if (this._storage.length !== undefined && typeof this._storage.key === 'function') {
      // if not supported try to use iteration via length
      // first build keys array, so this function will be delete-safe (eg if callback remove keys it won't cause problems due to index change)
      const keys = []

      for (let i = 0, len = Number(this._storage.length); i < len; ++i) {
        keys.push(this._storage.key(i))
      }
      // now actually iterate keys
      for (let i = 0; i < keys.length; ++i) {
        callback(keys[i])
      }
    } else {
      // if both methods above didn't work, iterate on all keys in storage class hoping for the best..
      Object.keys(this._storage).forEach((key) => callback(key))
    }
  }

  /**
   * Clear the entire storage and all keys in it.
   */
  clear() {
    this._storage.clear()
  }

  /**
   * Clear expired keys.
   * If you never call this function, expired keys will remain until you try to get them / reset a new value.
   *
   * @param return: List of removed keys due to expiration.
   */
  clearExpired(): Array<string> {
    // return list
    const ret: string[] = []

    this._iterKeys((storageKey) => {
      // if its not a timestamp key, skip it
      if (storageKey !== null && storageKey !== undefined && storageKey.indexOf(this._expiration_key_prefix) === 0) {
        // get item key
        const itemKey = storageKey.substr(this._expiration_key_prefix.length)

        // if expired remove it + the item
        if (this.isExpired(itemKey)) {
          this.removeItem(itemKey)
          ret.push(itemKey)
        }
      }
    })

    // return list with removed keys
    return ret
  }

  /**
   * Get a json serializable value. This basically calls JSON.parse on the returned value.
   * @param key: Item key to get (string).
   * @return: Stored value, or undefined if not set / expired.
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getJson(key: string): null | any {
    // get value
    const val = (this as unknown as ExpiredStorage).getItem(key)

    // if null, return null
    if (val === null || val === undefined) {
      return null
    }

    try {
      return JSON.parse(val)
    } catch (error) {
      Logger.error(error, { key })
      ;(this as unknown as ExpiredStorage).removeItem(key)

      return {}
    }
  }

  /**
   * Set a json serializable value. This basically calls JSON.stringify on 'val' before setting it.
   * @param key: Item key to set (string).
   * @param value: Value to store (object, will be stringified).
   * @param expiration: Expiration time, in seconds. If not provided, will not set expiration time.
   * @param return: Storage.setItem() return code.
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setJson(key: string, val: any, expiration?: number): any {
    // special case - make sure not undefined, because it would just write "undefined" and crash on reading.
    if (val === undefined) {
      throw new Error('Cannot set undefined value as JSON!')
    }

    // set stringified value
    return (this as unknown as ExpiredStorage).setItem(key, JSON.stringify(val), expiration)
  }
}

const getStorage = () => {
  let storage = null

  if (isSupported('localStorage')) {
    // use localStorage
    storage = new ExpiredStorage(window.localStorage)
  } else if (isSupported('sessionStorage')) {
    // use sessionStorage
    storage = new ExpiredStorage(window.sessionStorage)
  } else {
    // use memory
    storage = new ExpiredStorage(new MemoryStorage())
  }

  return storage
}

const Storage: ExpiredStorage = getStorage()

export { ExpiredStorage, Storage }
