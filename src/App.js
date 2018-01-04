import { renderRoutes } from 'react-router-config'

import 'styles/app'

import Home from 'views/Home'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
]

const App = () => renderRoutes(routes)

export default App
