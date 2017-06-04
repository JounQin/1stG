import webpack from 'webpack'
import BabiliPlugin from 'babili-webpack-plugin'
import SSRPlugin from 'ssr-webpack-plugin'
import _debug from 'debug'

import config, {globals, paths, pkg} from '../config'

import base, {nodeModules, CSS_LOADER, STYLUS_LOADER} from './base'

const {NODE_ENV, __PROD__} = globals

const debug = _debug('hi:webpack:server')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}`)

const serverConfig = {
  ...base,
  target: 'node',
  devtool: false,
  entry: paths.src('entry-server.js'),
  output: {
    ...base.output,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      ...base.module.rules,
      {
        test: /[/\\](app|bootstrap)\.styl$/,
        loader: __PROD__ ? 'null-loader' : `react-style-loader!${CSS_LOADER}!${STYLUS_LOADER}`,
        exclude: nodeModules
      }
    ]
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: true
    }),
    new SSRPlugin()
  ],
  externals: Object.keys(pkg.dependencies)
}

config.minimize && serverConfig.plugins.push(new BabiliPlugin())

export default serverConfig
