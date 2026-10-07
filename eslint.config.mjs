// @1stg/eslint-config is ESM while this package stays CommonJS -- build/*.js and the webpack output
// in dist/ are CJS -- so the flat config needs the explicit .mjs extension.
import path from 'node:path'

import recommended from '@1stg/eslint-config'
import { createNodeResolver } from 'eslint-plugin-import-x'
import react from 'eslint-plugin-react'
import globals from 'globals'

// build/base.js resolves bare specifiers from src/ and node_modules, the way webpack does. The
// resolver's own default is ["node_modules"], so it has to be restated.
const MODULE_DIRECTORIES = [path.resolve('src'), 'node_modules']

const MODULE_EXTENSIONS = ['js', 'jsx', 'json', 'scss', 'png', 'webp'].map(
  ext => `.${ext}`,
)

export default [
  ...recommended,
  {
    files: ['build/**/*.js', 'server/**/*.js', 'src/**/*.{js,jsx}'],
    settings: {
      'import-x/resolver-next': [
        createNodeResolver({
          extensions: MODULE_EXTENSIONS,
          modules: MODULE_DIRECTORIES,
        }),
      ],
    },
    languageOptions: {
      // Webpack substitutes these two at build time, and nothing declares them as real globals.
      // See build/base.js.
      globals: {
        __DEV__: 'readonly',
        __SERVER__: 'readonly',
      },
    },
    plugins: {
      react,
    },
    rules: {
      // Core no-unused-vars does not count an identifier that only appears in JSX. @1stg/eslint-config
      // leaves that to a React plugin, and the one it gates on ships no equivalent, so both rules
      // come from eslint-plugin-react: jsx-uses-vars for <Component />, and jsx-uses-react for the
      // React import that the classic JSX runtime needs.
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    // webpack 4 has no notion of the node: protocol -- it looks for a package called "node:fs" -- and
    // these are bundled into dist/server.js. build/template.js is deliberately not listed: node runs
    // it directly, so the prefixed form is correct there.
    files: ['build/config.js', 'server/**/*.js'],
    rules: {
      'unicorn-x/prefer-node-protocol': 'off',
    },
  },
  {
    // The client entry and the views it pulls in run in a browser.
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
]
