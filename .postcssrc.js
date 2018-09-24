const config = {
  plugins: {
    autoprefixer: null,
    'postcss-plugin-px2rem': {
      selectorBlackList: [/^html$/],
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.cssnano = {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  }
}

module.exports = config
