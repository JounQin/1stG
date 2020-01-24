import React, { useEffect } from 'react'
import { hot } from 'react-hot-loader/root'

import 'styles/app'

import { Home } from 'views/Home'

const WIDTH_THRESHOLD = 900
const HEIGHT_THRESHOLD = 600

const resize = () => {
  const { offsetWidth, offsetHeight } = document.documentElement
  document.documentElement.style.fontSize =
    offsetWidth < WIDTH_THRESHOLD || offsetHeight < HEIGHT_THRESHOLD
      ? Math.min(
          offsetWidth / WIDTH_THRESHOLD,
          offsetHeight / HEIGHT_THRESHOLD,
        ) *
          100 +
        'px'
      : null
}

const useResize = () =>
  useEffect(() => {
    resize()
    addEventListener('resize', resize)
    return () => removeEventListener('resize', resize)
  }, [])

const App = () => {
  useResize()
  return <Home />
}

export default __DEV__ ? hot(App) : App
