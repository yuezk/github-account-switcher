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

function patchFetchInput(input: FetchInput) {
  // Patching the Request object seems not working, so skip it
  if (input instanceof Request) {
    return input
  }

  const url = typeof input === 'string' ? input : input.href
  // Append the current account to the request url
  // <meta name="user-login" content="xxx">
  const account = document.querySelector<HTMLMetaElement>('meta[name="user-login"]')?.content
  if (!account) {
    return input
  }

  const newUrl = new URL(url, window.location.origin)
  newUrl.searchParams.append(ACCOUNT_PARAM, account)

  return typeof input === 'string' ? newUrl.href : newUrl
}

function patchFetch() {
  const originalFetch = window.fetch
  const patchedFetch: FetchFn = async (input, options) => {
    try {
      input = patchFetchInput(input)
    } catch (err) {
      console.warn('Failed to patch fetch input:', err)
    }

    try {
      const res = await originalFetch(input, options)
      return new PatchedResponse(res)
    } catch (err) {
      console.warn('Failed to fetch:', err)
      throw err
    }
  }
  window.fetch = patchedFetch
}

function init() {
  patchFetch()
}

init()
