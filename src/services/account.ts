import browser, { Cookies } from 'webextension-polyfill'
import cookie from './cookie'
import storage from './storage'

type Cookie = Cookies.Cookie
export type Account = {
  name: string
  cookies: Cookie[]
  active: boolean
  avatarUrl?: string
  expiresAt?: Date
}

type Accounts = Record<string, Cookie[]>

async function getAll(): Promise<Account[]> {
  const accounts = await storage.get<Accounts>('accounts')
  if (!accounts) {
    return []
  }

  const currentAccount = await browser.cookies.get({
    url: 'https://github.com',
    name: 'dotcom_user',
  })

  const avatarUrls = await storage.get<Record<string, string>>('avatars')

  return Object.entries(accounts).map(([name, cookies]) => {
    const userSessionCookie = cookies.find(({ name }) => name === 'user_session')
    return {
      name,
      cookies,
      active: currentAccount?.value === name,
      avatarUrl: avatarUrls?.[name],
      expiresAt: userSessionCookie?.expirationDate
        ? new Date(userSessionCookie.expirationDate * 1000)
        : undefined,
    }
  })
}

async function getAllNames(): Promise<string[]> {
  const accounts = await getAll()
  return accounts.map(({ name }) => name)
}

async function find(accountName: string): Promise<Account | undefined> {
  const accounts = await getAll()
  return accounts.find((account) => account.name === accountName)
}

async function upsert(accountName: string, cookies: Cookie[]) {
  await storage.update<Accounts>('accounts', (accounts = {}) => {
    accounts[accountName] = cookies
    return accounts
  })
}

async function switchTo(accountName: string) {
  await cookie.clear()

  const account = await find(accountName)
  const cookies = account?.cookies || []
  for (const cookie of cookies) {
    const { hostOnly, domain, session, ...rest } = cookie
    await browser.cookies.set({
      url: 'https://github.com',
      domain: hostOnly ? undefined : domain,
      ...rest,
    })
  }
}

async function remove(accountName: string) {
  await storage.update<Accounts>('accounts', (accounts) => {
    if (!accounts) {
      return
    }

    delete accounts[accountName]
    return accounts
  })
}

async function saveAvatar(accountName: string, avatarUrl: string) {
  await storage.update<Record<string, string>>('avatars', (avatars = {}) => {
    avatars[accountName] = avatarUrl
    return avatars
  })
}

export default {
  getAll,
  getAllNames,
  find,
  upsert,
  switchTo,
  remove,
  saveAvatar,
}
