import browser from 'webextension-polyfill'
import { Rule } from './services/rule'

function urlMatchesRule(url: string, rule: Rule) {
  const pattern = new RegExp(rule.urlPattern)
  return pattern.test(url)
}

function urlMatchesAnyRule(url: string, rules: Rule[]) {
  return rules.some((rule) => urlMatchesRule(url, rule))
}

export function isGitHubUrl(url: string | undefined) {
  if (!url) {
    return false
  }

  return /^https:\/\/(.+?\.)?github\.com/.test(url)
}

export function isNormalGitHubUrl(url: string | undefined, rules: Rule[]) {
  if (!url) {
    return false
  }

  if (!isGitHubUrl(url)) {
    return false
  }

  if (urlMatchesAnyRule(url, rules)) {
    return false
  }

  return true
}

export async function removeAccount(account: string) {
  await browser.runtime.sendMessage({ type: 'removeAccount', account })
}
