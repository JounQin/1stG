const fs = require('fs')
const { resolve } = require('path')

const SRC_DIR = resolve('src')

module.exports = {
  extends: ['@1stg'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.js',
      },
    },
    node: {
      allowModules: fs.readdirSync(SRC_DIR).map(_ => _.replace(/\.js$/, '')),
      resolvePaths: [SRC_DIR],
      tryExtensions: ['.js', '.scss'],
    },
  },
  env: {
    browser: true,
  },
  globals: {
    __DEV__: false,
    __SERVER__: false,
  },
}
