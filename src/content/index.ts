import browser from 'webextension-polyfill'
import { isNormalGitHubUrl, removeAccount } from '../shared'
import {
  ClearCookiesMessage,
  GetAccountsMessage,
  GetAccountsResponse,
  GetAutoSwitchRulesMessage,
  GetAutoSwitchRulesResponse,
} from '../types'
import './index.css'
// Script that will be injected in the main page
import { createElement } from './createElement'
import injectedScript from './injected?script&module'
import { ACCOUNT_ITEM_CLASS, ACCOUNT_REMOVE_CLASS, ADD_ACCOUNT_BUTTON_ID, createAccountItem, createAddAccountLink, createDivider } from './ui'

async function addSwitchUserMenu(logoutForm: HTMLFormElement) {
  const currentAccount = document.querySelector<HTMLMetaElement>('meta[name="user-login"]')?.content
  if (!currentAccount) {
    console.info('no current account found')
    return
  }

  if (!document.getElementById(ADD_ACCOUNT_BUTTON_ID)) {
    // Add the "Add another account" menu item and a divider
    const fragment = createElement('fragment', {
      children: [
        createAddAccountLink(),
        createDivider(),
      ],
    })

    // Insert the elements before the logoutForm
    logoutForm.parentElement?.insertBefore(fragment, logoutForm)
  }

  const res: GetAccountsResponse = await browser.runtime.sendMessage({
    type: 'getAccounts',
  } as GetAccountsMessage)

  if (!res?.success) {
    return
  }

  const { data: accounts } = res
  const addAccountButton = document.getElementById(ADD_ACCOUNT_BUTTON_ID)!
  for (const account of accounts) {
    if (account === currentAccount) {
      continue
    }

    const accountId = `${ACCOUNT_ITEM_CLASS}-${account}`
    if (!document.getElementById(accountId) && addAccountButton) {
      const accountWrapper = createAccountItem(account)
      addAccountButton.parentElement?.insertBefore(accountWrapper, addAccountButton)
    }
  }
}

async function getAutoSwitchRules() {
  const res: GetAutoSwitchRulesResponse = await browser.runtime.sendMessage({
    type: 'getAutoSwitchRules',
  } as GetAutoSwitchRulesMessage)

  return res?.success ? res.data : []
}

async function addAccount() {
  await browser.runtime.sendMessage({ type: 'clearCookies' } as ClearCookiesMessage)
  const autoSwitchRules = await getAutoSwitchRules()

  window.location.href = isNormalGitHubUrl(window.location.href, autoSwitchRules)
    ? `/login?return_to=${encodeURIComponent(window.location.href)}`
    : '/login'
}

async function switchAccount(account: string) {
  await browser.runtime.sendMessage({ type: 'switchAccount', account })
  const autoSwitchRules = await getAutoSwitchRules()

  if (isNormalGitHubUrl(window.location.href, autoSwitchRules)) {
    window.location.reload()
  } else {
    window.location.href = '/'
  }
}

function injectScript() {
  const script = document.createElement('script')
  script.src = browser.runtime.getURL(injectedScript)
  script.type = 'module'
  document.head.prepend(script)
}

function ready(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn()
    return
  }
  document.addEventListener('DOMContentLoaded', fn)
}

function watchDom() {
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const isOpen =
        mutation.type === 'attributes' &&
        mutation.attributeName === 'open' &&
        mutation.target instanceof HTMLElement &&
        mutation.target.hasAttribute('open')

      if (isOpen || (mutation.type === 'childList' && mutation.target instanceof HTMLElement)) {
        // Find the logout form on GitHub page or Gist page
        const logoutForm = mutation.target.querySelector<HTMLFormElement>(
          '.js-loggout-form, #user-links .logout-form, user-drawer-side-panel nav-list .ActionListItem:last-child',
        )
        if (logoutForm) {
          addSwitchUserMenu(logoutForm)
        }
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

async function init() {
  injectScript()
  ready(watchDom)

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement

    if (target.closest(`.${ADD_ACCOUNT_BUTTON_ID}`)) {
      // add another account
      event.preventDefault()
      addAccount()
    } else if (target.closest(`.${ACCOUNT_ITEM_CLASS}`)) {
      // switch to account
      const closestTarget = target.closest(`.${ACCOUNT_ITEM_CLASS}`) as HTMLElement
      const { account } = closestTarget.dataset
      switchAccount(account!)
    } else if (target.closest(`.${ACCOUNT_REMOVE_CLASS}`)) {
      // remove account
      const btn = target.closest(`.${ACCOUNT_REMOVE_CLASS}`) as HTMLElement
      const { account } = btn.dataset
      removeAccount(account!).then(() => {
        btn.parentElement?.remove()
      })
    }
  })
}

init()
