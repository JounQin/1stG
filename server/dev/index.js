import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import MFS from 'memory-fs'
import webpackDev from './webpack-dev'
import webpackHot from './webpack-hot'

import config, {paths} from '../../build/config'
import {clientConfig, serverConfig} from '../../build/webpack'

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(paths.dist(file), 'utf-8')
  } catch (e) {}
}

export default (app, cb) => {
  let bundle, template, fs
  let _resolve
  const readyPromise = new Promise(resolve => {
    _resolve = resolve
  })
  const ready = (...args) => {
    _resolve()
    cb(...args)
  }

  clientConfig.entry.app.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client')

  const clientCompiler = webpack(clientConfig)

  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: config.publicPath,
    hot: true,
    quiet: config.quiet,
    noInfo: config.quiet,
    lazy: false,
    stats: config.stats
  })

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(console.error)
    stats.warnings.forEach(console.warn)
    if (stats.errors.length) return

    fs = devMiddleware.fileSystem
    template = readFile(fs, 'index.html')
    bundle && ready(bundle, {template, fs})
  })

  app.use(webpackDev(clientCompiler, devMiddleware))
  app.use(webpackHot(clientCompiler))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return

    bundle = JSON.parse(readFile(mfs, 'ssr-bundle.json'))
    template && ready(bundle, {template, fs})
  })

  return readyPromise
}
