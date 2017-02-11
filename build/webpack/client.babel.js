import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg, vendors} from '../config'

import base, {CSS_LOADER, prodEmpty, nodeModules, STYLE_LOADER, STYLUS_LOADER} from './base'

const {minimize, devTool} = config

const sourceMap = !!devTool

const {NODE_ENV, __DEV__} = globals

const debug = _debug('hi:webpack:client')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}`)

let appLoader
let bootstrapLoader

const sourceLoaders = [CSS_LOADER, STYLUS_LOADER]

const loaderUtil = plugin => plugin && minimize ? plugin.extract({
  fallback: STYLE_LOADER,
  use: sourceLoaders
}) : [STYLE_LOADER, ...sourceLoaders]

const clientConfig = {
  ...base,
  target: 'web',
  entry: {
    app: [paths.src('entry-client')],
    vendors
  },
  module: {
    rules: [
      ...base.module.rules,
      {
        test: /[/\\]app\.styl$/,
        use: loaderUtil((appLoader = new ExtractTextPlugin(`${prodEmpty('app.')}[contenthash].css`))),
        exclude: nodeModules
      },
      {
        test: /[/\\]bootstrap\.styl$/,
        use: loaderUtil((bootstrapLoader = new ExtractTextPlugin(`${prodEmpty('bootstrap.')}[contenthash].css`))),
        exclude: nodeModules
      },
      {
        test: /[/\\]theme-\w+\.styl$/,
        loader: loaderUtil(),
        exclude: nodeModules
      }
    ]
  },
  plugins: [
    ...base.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: false
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors'),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !minimize,
        title: `${pkg.name} - ${pkg.description}`,
        polyfill: !__DEV__
      }),
      favicon: paths.src('static/favicon.ico'),
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: minimize,
        minifyJS: minimize
      }
    })
  ]
}

if (minimize) {
  Object.assign(clientConfig.resolve.alias, {
    react: 'react-lite',
    'react-dom': 'react-lite'
  })
  clientConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: !sourceMap,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      comments: false,
      sourceMap
    }),
    bootstrapLoader,
    appLoader
  )
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  debug(`Enable plugins for ${NODE_ENV} (SWPrecache).`)

  clientConfig.plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: 'vue-ssr',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

export default clientConfig
