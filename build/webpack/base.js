import webpack from 'webpack'

import config, {alias, globals, paths} from '../config'

const {__PROD__} = globals

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const {browsers, devTool, minimize} = config

const sourceMap = !!devTool

export const prodEmpty = str => (__PROD__ ? '' : str)

const filename = `${prodEmpty('[name].')}[${config.hashType}].js`

const urlLoader = `url-loader?${JSON.stringify({
  limit: 10000,
  name: `${prodEmpty('[name].')}[hash].[ext]`
})}`

const cssMinimize = minimize && {
  autoprefixer: {
    add: true,
    remove: true,
    browsers
  },
  discardComments: {
    removeAll: true
  },
  safe: true,
  sourcemap: sourceMap
}

const cssOptions = {
  minimize,
  sourceMap,
  ...cssMinimize
}

export const STYLE_LOADER = 'react-style-loader'

export const CSS_LOADER = 'css-loader?' + JSON.stringify(cssOptions)
export const localIdentName = __PROD__ ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]'

const cssModuleOptions = {
  modules: true,
  camelCase: true,
  importLoaders: 2,
  localIdentName
}

export const CSS_MODULE_LOADER =
  'css-loader?' + JSON.stringify(Object.assign({react: true}, cssOptions, cssModuleOptions))

export const nodeModules = /\bnode_modules\b/

export const STYLUS_LOADER = 'stylus-loader?paths=node_modules/bootstrap-styl/'

export default {
  resolve: {
    modules: [paths.src(), PACKAGES, NODE_MODULES],
    extensions: ['.js', '.styl'],
    enforceExtension: false,
    enforceModuleExtension: false,
    alias
  },
  resolveLoader: {
    modules: [PACKAGES, NODE_MODULES]
  },
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: devTool,
  module: {
    rules: [
      {
        test: /^(?!.*[/\\](app|bootstrap|theme-\w+)\.styl$).*\.styl$/,
        loader: ['react-style-loader', CSS_MODULE_LOADER, STYLUS_LOADER],
        exclude: nodeModules
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        exclude: nodeModules
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: urlLoader + '!img-loader?minimize&progressive=true'
      },
      {
        test: /\.(svg|woff2?|eot|ttf)$/,
        loader: urlLoader
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize,
      stylus: {
        default: {
          import: [paths.src('styles/_variables.styl')]
        }
      }
    })
  ]
}
