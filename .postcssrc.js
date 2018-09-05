const config = {
  plugins: {
    'postcss-plugin-px2rem': {
      rootValue: 16,
      selectorBlackList: ['html'],
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  Object.assign(config.plugins, {
    autoprefixer: null,
    cssnano: null,
  })
}

module.exports = config
