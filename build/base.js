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
  test: /\.jsx?$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    cacheDirectory: true,
    ...(isServer && {
      presets: [
        [
          '@1stg',
          {
            modules: false,
            react: true,
            isTSX: true,
          },
        ],
      ],
      babelrc: false,
    }),
  },
})

export default {
  mode: NODE_ENV,
  resolve: {
    alias: __DEV__
      ? {
          'react-dom': '@hot-loader/react-dom',
        }
      : {
          react: 'anujs',
          'react-dom': 'anujs',
          'react-dom/server': 'anujs/dist/React/server',
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
              // eslint-disable-next-line no-magic-numbers
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
