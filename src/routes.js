const resolve = (promise, callback) => promise.then(module => callback(null, module.default))

export default {
  path: '/',
  getIndexRoute(partialNextState, callback) {
    System.import('views/Home').then(module => callback(null, {component: module.default}))
  },
  childRoutes: [
    {
      path: 'counter',
      getComponent(nextState, callback) {
        resolve(System.import('views/Counter'), callback)
      }
    }
  ]
}
