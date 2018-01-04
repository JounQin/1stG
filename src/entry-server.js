import React from 'react'
import { StaticRouter } from 'react-router'

import App from 'App'

export default context =>
  Promise.resolve(
    <StaticRouter location={context.ctx.url} context={context}>
      <App />
    </StaticRouter>,
  )
