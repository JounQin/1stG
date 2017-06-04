import React from 'react'
import {withRouter} from 'react-router'
import axios from 'axios'

import 'styles/bootstrap'
import 'styles/app'

import empty from 'styles/_empty'

const proto = React.Component.prototype

if (!__DEV__ || !proto.hasOwnProperty('$ssrContext')) {
  Object.defineProperty(proto, '$ssrContext', {
    get() {
      return this.props.router.ssrContext
    }
  })
}

if (__SERVER__) {
  if (!__DEV__ || !proto.hasOwnProperty('$http')) {
    Object.defineProperty(proto, '$http', {
      get() {
        return this.$ssrContext.axios
      }
    })
  }
} else {
  Object.defineProperty(proto, '$http', {value: axios})
}

global.withStyle = (Component, style = empty, router = true) => {
  class WrappedComponent extends Component {
    componentWillMount() {
      style.__inject__ && style.__inject__(this.$ssrContext)
    }
  }
  return router ? withRouter(WrappedComponent) : WrappedComponent
}

const resolve = (promise, callback) => promise.then(module => callback(null, module.default))

export default axios => ({
  path: '/',
  getIndexRoute(partialNextState, callback) {
    import('views/Home').then(module => callback(null, {component: module.default}))
  },
  childRoutes: [
    {
      path: 'counter',
      getComponent(nextState, callback) {
        resolve(import('views/Counter'), callback)
      }
    }
  ]
})
