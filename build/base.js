import webpack from 'webpack'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { NODE_ENV, __DEV__, hashType, resolve } from './config'

const sourceMap = __DEV__

const cssLoaders = modules => [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap,
      modules: modules && {
        localIdentName: __DEV__
          ? '[path][name]__[local]--[hash:base64:5]'
          : '[hash:base64:5]',
      },
      importLoaders: 2,
      localsConvention: 'camelCase',
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap,
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap,
    },
  },
]

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
  mode: NODE_ENV,
  resolve: {
    alias: __DEV__
      ? {}
      : {
          react: 'anujs',
          'react-dom': 'anujs',
          'prop-types': 'anujs/lib/ReactPropTypes',
        },
    extensions: ['.js', '.scss'],
    modules: [resolve('src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(png|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,
            },
          },
          'img-loader',
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
        options: {
          pretty: __DEV__,
        },
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            test: /app.scss$/,
            use: cssLoaders(),
          },
          {
            use: cssLoaders(true),
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__,
    }),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].[${hashType}].css`,
    }),
  ],
}
