// @1stg/eslint-config is ESM, so the flat config needs the explicit .mjs extension.
import path from 'node:path'

import recommended from '@1stg/eslint-config'
import { createNodeResolver } from 'eslint-plugin-import-x'
import globals from 'globals'

// Vite resolves bare specifiers from src/ (see the alias table in vite.config.ts). The resolver's
// own default is ["node_modules"], so it has to be restated.
const MODULE_DIRECTORIES = [path.resolve('src'), 'node_modules']

const MODULE_EXTENSIONS = ['ts', 'tsx', 'json', 'scss', 'png', 'webp'].map(
  ext => `.${ext}`,
)

export default [
  ...recommended,
  {
    // Build-time scripts run under node and are excluded from tsconfig (see the comment there), so
    // the typed project service has nothing to attach them to.
    ignores: ['build/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    settings: {
      'import-x/resolver-next': [
        createNodeResolver({
          extensions: MODULE_EXTENSIONS,
          modules: MODULE_DIRECTORIES,
        }),
      ],
    },
  },
  {
    // The client entry and the views it pulls in run in a browser.
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // index.html only holds the static shell: the webp/fontSize bootstrap, the #skip critical CSS
    // and the #app mount point. @1stg/eslint-config turns on the whole markup preset here, and its
    // required-h1 rule cannot be turned off individually (the preset expands after the configs are
    // merged), while the page's only headings are the four tile titles, which are h2. Adding an h1
    // would change what the site renders, so the preset goes off for this one file.
    files: ['**/*.html'],
    rules: {
      'markup/markup': 'off',
    },
  },
]
