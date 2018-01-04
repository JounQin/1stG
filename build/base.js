import webpack from 'webpack'
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import px2rem from 'postcss-plugin-px2rem'
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin'

import { NODE_ENV, __DEV__, resolve } from './config'

const souceMap = __DEV__
const minimize = !souceMap

const cssLoaders = react =>
  ExtractTextWebpackPlugin.extract({
    fallback: {
      loader: 'react-style-loader',
      options: {
        react,
      },
    },
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize,
          souceMap,
          modules: react,
          camelCase: true,
          importLoaders: 2,
          localIdentName: __DEV__
            ? '[path][name]__[local]--[hash:base64:5]'
            : '[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          minimize,
          souceMap,
          plugins: [
            px2rem({
              rootValue: 16,
              selectorBlackList: ['html'],
            }),
          ],
        },
      },
      {
        loader: 'sass-loader',
        options: {
          minimize,
          souceMap,
        },
      },
    ],
  })

export const babelLoader = isServer => ({
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    cacheDirectory: true,
    ...(isServer && {
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            exclude: [
              'babel-plugin-transform-async-to-generator',
              'babel-plugin-transform-regenerator',
            ],
          },
        ],
      ],
    }),
  },
})

export default {
  devtool: __DEV__ && 'cheap-module-source-map',
  resolve: {
    alias: {
      lodash: 'lodash-es',
    },
    extensions: ['.js', '.scss'],
    modules: [resolve('src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
          'img-loader',
        ],
      },
      {
        test: /\.pug$/,
        use: [
          'apply-loader',
          {
            loader: 'pug-loader',
            options: {
              pretty: __DEV__,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            test: /app.scss$/,
            use: cssLoaders(),
          },
          {
            test: /./,
            use: cssLoaders(true),
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      context: __dirname,
    }),
    new ExtractTextWebpackPlugin({
      disable: true, // app.css is too small (0.73 KB gzipped) for now, so disable it
      filename: '[name].[contenthash].css',
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      __DEV__,
    }),
    ...(__DEV__
      ? [new webpack.NamedModulesPlugin(), new webpack.NamedChunksPlugin()]
      : [
          new UglifyjsWebpackPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.optimize.ModuleConcatenationPlugin(),
        ]),
  ],
}
