import browser from 'webextension-polyfill'

export async function setBadgeText(text: string) {
  const action = browser.action || browser.browserAction
  await action.setBadgeText({
    text
  })
  await action.setBadgeBackgroundColor({
    color: '#44b700',
  })
  action.setBadgeTextColor({
    color: '#fff',
  })
}
