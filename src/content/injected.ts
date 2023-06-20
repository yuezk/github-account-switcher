type FetchFn = typeof fetch
type FetchInput = Parameters<FetchFn>[0]

const ACCOUNT_PARAM = '__account__'

class PatchedResponse extends Response {
  constructor(private readonly response: Response) {
    super(response.body, response)
  }

  get url() {
    const url = new URL(this.response.url, window.location.origin)
    url.searchParams.delete(ACCOUNT_PARAM)
    return url.href
  }
}

function patchUrl(oldUrl: string | URL) {
  const account = document.querySelector<HTMLMetaElement>('meta[name="user-login"]')?.content
  if (!account) {
    return oldUrl
  }

  const newUrl = new URL(oldUrl, window.location.origin)
  newUrl.searchParams.append(ACCOUNT_PARAM, account)

  return newUrl
}

function patchRequestInfo(input: RequestInfo | URL) {
  if (input instanceof Request) {
    return input
  }

  return patchUrl(input)
}

function patchRequest() {
  const OriginalRequest = window.Request
  class PatchedRequest extends OriginalRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(patchRequestInfo(input), init)
    }
  }

  window.Request = PatchedRequest
}

function patchFetch() {
  const originalFetch = window.fetch
  const patchedFetch: FetchFn = async (input, options) => {
    try {
      const res = await originalFetch(patchRequestInfo(input), options)
      return new PatchedResponse(res)
    } catch (err) {
      console.warn('Failed to fetch:', err)
      throw err
    }
  }
  window.fetch = patchedFetch
}

function init() {
  patchRequest()
  patchFetch()
}

init()
