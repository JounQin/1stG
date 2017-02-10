import React from 'react'

import {createStore, combineReducers, compose, applyMiddleware} from 'redux'

import {routerReducer, routerMiddleware} from 'react-router-redux'

export const configureStore = (history, initialState) => {
  const reducer = combineReducers({
    routing: routerReducer
  })

  let devTools = []
  __DEV__ && !__SERVER__ && devTools.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

  return createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(history)
      ),
      ...devTools
    )
  )
}
