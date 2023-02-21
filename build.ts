import { readFile } from 'fs'
import { parse } from 'node-html-parser'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { minify } from 'terser'

const htmlPath = resolve(dirname(fileURLToPath(import.meta.url)), '../index.html')
const srcPath = resolve(dirname(fileURLToPath(import.meta.url)), 'index.js')

const html = assertNotNull(await readFileAsync(htmlPath))
const sourceCode = assertNotNull(await readFileAsync(srcPath))
const { code } = await minify(sourceCode, { toplevel: true, mangle: true, module: true })
const encodedResult = encodeURI(assertNotNull(code))

const root = parse(html)

// replace the `href`
const bookmarkletEl = assertNotNull(root.querySelector('a[bookmarklet]'))
bookmarkletEl.setAttribute('href', `javascript:(function(){${encodedResult}})();`)

// add last build time
const buildTimeEl = root.querySelector('[build-time]')
if (buildTimeEl) {
  buildTimeEl.setAttribute('build-time', Date.now().toString())
  buildTimeEl.innerHTML = new Date().toString()
}

// Print updated HTML
console.log(root.outerHTML)

// util
function assert(expression: unknown, message = 'Assertion Error'): asserts expression {
  if (!expression) throw new Error(message)
}
function assertNotNull<T>(expression: T, message?: string): NonNullable<T> {
  assert(expression != null, message)
  return expression
}
function readFileAsync(path: string) {
  return new Promise<string>((resolve, reject) =>
    readFile(path, 'utf-8', (err, data) => (err ? reject(err) : resolve(data)))
  )
}
