import fs from 'fs'

import _debug from 'debug'
import Koa from 'koa'
import compose from 'koa-compose'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static-cache'
import { createBundleRenderer } from 'react-server-renderer'

import { version as koaVersion } from 'koa/package.json'
import { version as reactSsrVersion } from 'react-server-renderer/package.json'

import {
  resolve,
  runtimeRequire,
  serverHost,
  serverPort,
} from '../build/config'

const debug = _debug('1stg:server')

const template =
  process.env.NODE_ENV === 'development'
    ? require('pug').renderFile(resolve('server/template.pug'), {
        pretty: true,
      })
    : fs.readFileSync(resolve('dist/template.html'), 'utf-8')

const app = new Koa()

let ready, renderer

const MAX_AGE = 1000 * 3600 * 24 * 365 // one year

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; react-server-renderer/${reactSsrVersion}`,
}

const middlewares = [
  logger(),
  serve('public', {
    maxAge: MAX_AGE,
  }),
  async (ctx, next) => {
    await ready

    if (
      ctx.method !== 'GET' ||
      ctx.url.lastIndexOf('.') > ctx.url.lastIndexOf('/') ||
      !['*/*', 'text/html'].find(mimeType =>
        ctx.get('Accept').includes(mimeType),
      )
    ) {
      return next()
    }

    if (ctx.path !== '/') {
      return ctx.redirect('/')
    }

    ctx.body = renderer
      .renderToStream({ ctx, title: '1stG.me' })
      .on('afterRender', () => {
        ctx.set(DEFAULT_HEADERS)
      })
  },
]

const createRenderer = (bundle, options) =>
  createBundleRenderer(bundle, {
    ...options,
    template,
    basedir: resolve('dist/static'),
    runInNewContext: false,
  })

if (process.env.NODE_ENV === 'development') {
  const { readyPromise, webpackMiddleware } = require('./dev').default(
    ({ bundle, clientManifest }) => {
      renderer = createRenderer(bundle, {
        clientManifest,
      })
    },
  )
  ready = readyPromise
  middlewares.push(webpackMiddleware)
} else {
  renderer = createRenderer(
    runtimeRequire(resolve('dist/ssr-server-bundle.json')),
    {
      clientManifest: runtimeRequire(resolve('dist/ssr-client-manifest.json')),
    },
  )

  const files = {}

  middlewares.splice(
    1,
    0,
    compress(),
    serve(
      resolve('dist/static'),
      {
        maxAge: MAX_AGE,
      },
      files,
    ),
  )

  files['/service-worker.js'].maxAge = 0
}

app.use(compose(middlewares))

app.listen(serverPort, serverHost, () => {
  debug(`Server start listening at %s:%s`, serverHost, serverPort)
})
