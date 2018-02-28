import React from 'react'

import 'styles/app'

import Home from 'views/Home'

const WIDTH_THRESHOLD = 900
const HEIGHT_THRESHOLD = 600

export default class App extends React.PureComponent {
  state = {
    scale: null,
  }

  constructor(props) {
    super(props)
    this.resize = this.resize.bind(this)
  }

  resize() {
    const { offsetWidth, offsetHeight } = document.documentElement

    this.setState({
      scale:
        offsetWidth < WIDTH_THRESHOLD || offsetHeight < HEIGHT_THRESHOLD
          ? Math.min(
              offsetWidth / WIDTH_THRESHOLD,
              offsetHeight / HEIGHT_THRESHOLD,
            )
          : null,
    })
  }

  componentDidMount() {
    this.resize()
    addEventListener('resize', this.resize, false)
  }

  componentWillUnmount() {
    removeEventListener('resize', this.resize, false)
  }

  render() {
    const { scale } = this.state
    return <Home style={scale ? { transform: `scale(${scale})` } : null} />
  }
}
