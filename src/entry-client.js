import 'styles/app'
import 'styles/bootstrap'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {syncHistoryWithStore} from 'react-router-redux'
import {match, Router, applyRouterMiddleware, browserHistory} from 'react-router'
import {useScroll} from 'react-router-scroll'
import {AppContainer} from 'react-hot-loader'

import routes from 'routes'
import {configureStore} from 'store'

const store = configureStore(browserHistory, window.__initialState__)

const history = syncHistoryWithStore(browserHistory, store)

const renderApp = () => match({history, routes}, (error, redirectLocation, renderProps) => render(
  <AppContainer>
    <Provider store={store}>
      <Router {...renderProps} render={applyRouterMiddleware(useScroll())} key={Math.random()}/>
    </Provider>
  </AppContainer>,
  document.getElementById('app')
))

renderApp()

if (module.hot) module.hot.accept('routes', renderApp)

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')
