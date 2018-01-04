import webpack from 'webpack'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import { SSRServerPlugin } from 'ssr-webpack-plugin'

import { publicPath, resolve } from './config'

import base, { babelLoader } from './base'

export default merge.smart(base, {
  entry: resolve('src/entry-server.js'),
  target: 'node',
  output: {
    publicPath,
    path: resolve('dist'),
    filename: `[name].[chunkhash].js`,
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    whitelist: /\.css$/,
  }),
  module: {
    rules: [babelLoader(true)],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_ENV': '"server"',
      __SERVER__: true,
    }),
    new SSRServerPlugin(),
  ],
})
