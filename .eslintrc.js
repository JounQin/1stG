module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: [
    'babel',
    'standard',
    'react'
  ],
  extends: [
    'standard',
    'react'
  ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    'array-bracket-spacing': 2,
    'babel/object-curly-spacing': 2,
    'computed-property-spacing': 2,
    'eol-last': 2,
    'generator-star-spacing': 2,
    'indent': [2, 2],
    'max-depth': 2,
    'max-len': [
      2,
      120,
      2
    ],
    'max-nested-callbacks': 2,
    'max-params': [2, 5],
    'no-empty': [2, {allowEmptyCatch: true}],
    'no-unused-expressions': 0,
    'quote-props': 0,
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': [2, {
      ignore: ['children']
    }],
    'standard/no-callback-literal': 0,
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    'object-curly-spacing': 0,
    'prefer-reflect': 0
  }
}
