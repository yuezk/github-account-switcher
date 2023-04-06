import browser from 'webextension-polyfill'
const COOKIE_URL = 'https://github.com'

async function get(name: string) {
  return browser.cookies.get({ url: COOKIE_URL, name })
}

async function getAll() {
  return browser.cookies.getAll({ url: COOKIE_URL })
}

async function clear() {
  const cookies = await getAll()
  for (const cookie of cookies) {
    await browser.cookies.remove({ url: COOKIE_URL, name: cookie.name })
  }
}

export default {
  get,
  getAll,
  clear,
}
