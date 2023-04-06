import { Rule } from './services/rule'

type Message<T extends string, P = {}> = { type: T } & P

type ErrorResponse = { success: false; error: Error }
export type Response<T = void> = { success: true; data: T } | ErrorResponse

export type GetAccountsMessage = Message<'getAccounts'>
export type GetAccountsResponse = Response<string[]>

export type SwitchAccountMessage = Message<'switchAccount', { account: string }>
export type SwitchAccountResponse = Response

export type ClearCookiesMessage = Message<'clearCookies'>
export type ClearCookiesResponse = Response

export type RemoveAccountMessage = Message<'removeAccount', { account: string }>
export type RemoveAccountResponse = Response

export type GetAutoSwitchRulesMessage = Message<'getAutoSwitchRules'>
export type GetAutoSwitchRulesResponse = Response<Rule[]>

export type RequestMessage =
  | GetAccountsMessage
  | ClearCookiesMessage
  | SwitchAccountMessage
  | RemoveAccountMessage
  | GetAutoSwitchRulesMessage
