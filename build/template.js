const fs = require('node:fs')
const path = require('node:path')

const { minify } = require('html-minifier')
const pug = require('pug')

const result = minify(pug.renderFile('server/template.pug'), {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
})

fs.mkdirSync('dist/static', { recursive: true })

fs.writeFileSync(path.resolve('dist/template.html'), result)
