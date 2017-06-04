import React from 'react'
import {renderToString} from 'react-dom/server'
import {createMemoryHistory, match, RouterContext} from 'react-router'
import _axios from 'axios'

import createRoutes from 'routes'

export default context => new Promise((resolve, reject) => {
  const start = __DEV__ && Date.now()

  const {ctx} = context
  const {url} = ctx

  const axios = _axios.create()

  axios.defaults.headers = ctx.headers

  match({
    history: createMemoryHistory(url),
    routes: createRoutes(axios),
    location: url
  }, (error, redirectLocation, renderProps) => {
    let status, content

    if (error) return reject(error)

    if (redirectLocation) {
      content = redirectLocation.pathname + redirectLocation.search
      status = 302
    } else {
      renderProps.router.ssrContext = Object.assign(context, {axios})
      content = renderToString(<RouterContext {...renderProps}/>)
    }

    __DEV__ && console.log(`data pre-fetch: ${Date.now() - start}ms`)
    resolve({content, status})
  })
})
