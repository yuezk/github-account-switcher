import { createElement, createRemoveIcon } from './createElement'

export const ADD_ACCOUNT_BUTTON_ID = 'gh-account-switcher__add-account'
export const ACCOUNT_ITEM_CLASS = 'gh-account-switcher__account'
export const ACCOUNT_REMOVE_CLASS = 'gh-account-switcher__account-remove'

function isNewLook() {
  return document.querySelector('.AppHeader-user') !== null
}

function uiLook() {
  return isNewLook() ? newLook : classicLook
}

const classicLook = {
  createDivider() {
    return createElement('div', {
      class: 'dropdown-divider'
    })
  },
  createAddAccountLink() {
    return createElement('a', {
      id: ADD_ACCOUNT_BUTTON_ID,
      href: '/login',
      class: `dropdown-item ${ADD_ACCOUNT_BUTTON_ID}`,
      children: 'Add another account'
    })
  },
  createAccountItem(account: string) {
    const accountId = `${ACCOUNT_ITEM_CLASS}-${account}`
    return createElement('div', {
      id: accountId,
      class: 'gh-account-switcher__account-wrapper',
      children: [
        createElement('button', {
          'data-account': account,
          class: `dropdown-item btn-link ${ACCOUNT_ITEM_CLASS}`,
          role: 'menuitem',
          children: [
            'Switch to ',
            createElement('b', { children: account }),
          ],
        }),
        createElement('button', {
          title: 'Remove account',
          class: `btn-link ${ACCOUNT_REMOVE_CLASS}`,
          'data-account': account,
          children: createRemoveIcon(),
        }),
      ]
    })
  }
}

const newLook = {
  createDivider() {
    return createElement('li', {
      class: 'ActionList-sectionDivider'
    })
  },
  createAddAccountLink() {
    return createElement('li', {
      id: ADD_ACCOUNT_BUTTON_ID,
      class: 'ActionListItem',
      children: [
        createElement('a', {
          class: `ActionListContent ${ADD_ACCOUNT_BUTTON_ID}`,
          href: '/login',
          children: [
            createElement('span', {
              class: 'ActionListItem-label',
              children: 'Add another account'
            })
          ]
        })
      ]
    })
  },
  createAccountItem(account: string) {
    const accountId = `${ACCOUNT_ITEM_CLASS}-${account}`
    return createElement('li', {
      id: accountId,
      class: 'ActionListItem',
      children: [
        createElement('button', {
          'data-account': account,
          class: `ActionListContent ${ACCOUNT_ITEM_CLASS}`,
          children: [
            createElement('span', {
              class: 'ActionListItem-label',
              children: [
                'Switch to ',
                createElement('b', { children: account }),
              ]
            })
          ]
        }),
        createElement('button', {
          title: 'Remove account',
          'data-account': account,
          class: `btn-link color-fg-danger ${ACCOUNT_REMOVE_CLASS}`,
          children: createRemoveIcon(),
        })
      ]
    })
  }
}

export function createDivider() {
  const look = uiLook()
  return look.createDivider();
}

export function createAddAccountLink() {
  const look = uiLook()
  return look.createAddAccountLink();
}

export function createAccountItem(account: string) {
  const look = uiLook()
  return look.createAccountItem(account);
}
