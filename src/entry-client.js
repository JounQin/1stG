import React from 'react'
import { hydrate } from 'react-dom'

import App from 'App'

if (__DEV__) {
  hydrate(<App />, document.getElementById('app'))
}

if (
  !__DEV__ &&
  (location.protocol === 'https:' ||
    ['127.0.0.1', 'localhost'].includes(location.hostname)) &&
  navigator.serviceWorker
) {
  navigator.serviceWorker.register('./service-worker.js')
}
