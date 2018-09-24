import React from 'react'

import 'styles/app'

import Home from 'views/Home'

const WIDTH_THRESHOLD = 900
const HEIGHT_THRESHOLD = 600

export default class App extends React.PureComponent {
  resize = () => {
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

  componentDidMount() {
    addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resize)
  }

  render() {
    return <Home />
  }
}
