// TODO move these to a helper file but that requires a builder to merge all into one file.
/** Assert an expression is true. */
function assert(expression: unknown, message = 'Assertion Error'): asserts expression {
  if (!expression) throw new Error(message)
}

/** Assert an expression is not null, and returns it. */
function assertNotNull<T>(expression: T, message?: string): NonNullable<T> {
  assert(expression != null, message)
  return expression
}

/** Downloads an auto generated file locally. */
function download(filename: string, text: string, meta: BlobPropertyBag = { type: 'text/csv' }) {
  const element = document.createElement('a')
  element.setAttribute('href', URL.createObjectURL(new Blob([text], meta)))
  element.setAttribute('download', filename)

  // simulate click on invisible link to start download
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  // maybe we shouldn't remove the element immediately
  // document.body.removeChild(element)
}

try {
  const { hostname, href, pathname } = location
  assert(hostname.endsWith('reddit.com'), `Click again when you're on reddit`)
  assert(pathname.match(/\/r\/.+\/comments\/.+/), `Click again when you have a reddit post open`)

  const redirect = new URL(href)
  redirect.hostname = 'redditdl.com'

  location.href = redirect.toString()
} catch (err) {
  assert(err instanceof Error)
  alert(err.message)
}
