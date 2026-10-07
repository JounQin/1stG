/* eslint-disable camelcase */
// webpack 4 cannot resolve the node: protocol, and this module is bundled into dist/server.js.
import path from 'path'

export const NODE_ENV = process.env.NODE_ENV || 'development'

export const __DEV__ = NODE_ENV === 'development'

export const hashType = __DEV__ ? 'hash' : 'contenthash'

export const serverHost = '0.0.0.0'

// eslint-disable-next-line no-magic-numbers
export const serverPort = process.env.PORT || 4000

export const publicPath = '/'

export const { resolve } = path

export const runtimeRequire =
  typeof __non_webpack_require__ === 'undefined'
    ? require
    : __non_webpack_require__
