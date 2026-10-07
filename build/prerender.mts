// Renders the app into the built index.html, replacing the webpack-era "start a Koa server, curl
// it, and write the response to a file" step. The output is the same static page Pages serves.
// Node 24 strips the types itself, so this runs straight from source as `node build/prerender.mts`.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const { render } = (await import('../dist/server/entry-server.mjs')) as {
  render: () => string
}

const target = fileURLToPath(new URL('../dist/static/index.html', import.meta.url))
const template = readFileSync(target, 'utf8')

const rendered = template.replace('<!--app-html-->', render())

if (rendered === template) {
  throw new Error('index.html has no <!--app-html--> placeholder to fill in')
}

writeFileSync(target, rendered)

console.log(`prerendered ${target} (${rendered.length} bytes)`)
