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
function download(filename: string, href: string | URL) {
  const element = document.createElement('a')
  element.setAttribute('href', href.toString())
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

  const title = document.querySelector('h1')?.textContent ?? `reddit video ${Date.now}.mp4`
  const metaEl = assertNotNull(
    document.querySelector(`meta[property="og:video"]`),
    'Can not find video path (video might be NSWF)'
  )
  const videoUrl = new URL(
    assertNotNull(metaEl.getAttribute('content'), 'Path to video is missing')
  )
  const [, id] = videoUrl.pathname.split('/')
  videoUrl.pathname = `/${id}/DASH_1040.mp4`

  download(title, videoUrl)
} catch (err) {
  assert(err instanceof Error)
  alert(err.message)
}
