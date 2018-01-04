import webpack from 'webpack'
import merge from 'webpack-merge'
import { SSRClientPlugin } from 'ssr-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'

import { __DEV__, publicPath, resolve } from './config'

import base, { babelLoader } from './base'

const clientConfig = merge.smart(base, {
  entry: {
    app: [resolve('src/entry-client.js')],
    vendors: [
      'react',
      'react-dom',
      'react-router',
      'react-router-config',
      'react-router-dom',
    ],
  },
  output: {
    publicPath,
    path: resolve('dist/static'),
    filename: `[name].[${__DEV__ ? 'hash' : 'chunkhash'}].js`,
  },
  module: {
    rules: [babelLoader()],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_ENV': '"client"',
      __SERVER__: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest'],
    }),
    new SSRClientPlugin({
      filename: '../ssr-client-manifest.json',
    }),
  ],
})

if (!__DEV__) {
  clientConfig.plugins.push(
    // auto generate service worker
    new SWPrecacheWebpackPlugin({
      cacheId: 'react-ssr',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst',
        },
      ],
    }),
  )
}

export default clientConfig
