import browser from 'webextension-polyfill'
async function set<T>(key: string, value: T) {
  await browser.storage.local.set({ [key]: value })
}

async function get<T>(key: string): Promise<T | undefined> {
  const { [key]: value } = await browser.storage.local.get(key)
  return value as T
}

async function update<T>(key: string, updater: (value?: T) => T | undefined) {
  const value = await get<T>(key)
  await set(key, updater(value))
}

async function clear() {
  await browser.storage.local.clear()
}

export default {
  get,
  set,
  update,
  clear,
}
