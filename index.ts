/* filenames reddit uses in sorted by highest quality. */
const potentialFilenames = [
  'DASH_1040.mp4',
  'DASH_720.mp4',
  'DASH_480.mp4',
  'DASH_360.mp4',
  'DASH_240.mp4',
]
const { hostname, href, pathname } = location

try {
  assert(hostname.endsWith('reddit.com'), `Click again when you're on reddit`)
  assert(pathname.match(/\/r\/.+\/comments\/.+/), `Click again when you have a reddit post open`)

  const title = document.querySelector('h1')?.textContent ?? `reddit video ${Date.now}.mp4`
  const sourceEl = assertNotNull(
    document.querySelector(`source`),
    'Can not find video path (video might be NSFW)'
  )
  const videoUrl = new URL(
    assertNotNull(sourceEl.getAttribute('src'), 'Path to video is missing')
  )
  const [, id] = videoUrl.pathname.split('/')
  let downloadUrl
  for (const filename of potentialFilenames) {
    videoUrl.pathname = `/${id}/${filename}`
    const { ok } = await fetch(videoUrl, { method: 'HEAD' })
    if (ok) {
      downloadUrl = videoUrl.toString()
      break
    }
  }

  download(title, assertNotNull(downloadUrl, 'Unable to find direct destination of video'))
} catch (err) {
  assert(err instanceof Error)
  console.error('reddit-video-downloader', err.message)

  // redirect to a helper site
  const url = new URL(href)
  url.host = 'redditdl.com'
  location.href = url.toString()
}

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
function download(filename: string, href: string) {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)

  // simulate click on invisible link to start download
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  // maybe we shouldn't remove the element immediately
  // document.body.removeChild(element)
}

export {}
