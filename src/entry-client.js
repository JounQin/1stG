import React from 'react'
import { hydrate } from 'react-dom'

import App from 'App'

const AppContainer = __DEV__
  ? require('react-hot-loader').AppContainer
  : ({ children }) => children

const render = () => {
  const app = (
    <AppContainer>
      <App />
    </AppContainer>
  )

  hydrate(app, document.getElementById('app'))
}

render()

if (module.hot) {
  module.hot.accept('App', render)
}

if (
  !__DEV__ &&
  (location.protocol === 'https:' ||
    ['127.0.0.1', 'localhost'].includes(location.hostname)) &&
  navigator.serviceWorker
) {
  navigator.serviceWorker.register('./service-worker.js')
}
