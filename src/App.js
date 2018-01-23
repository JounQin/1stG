import React from 'react'

import 'styles/app'

import Home from 'views/Home'

export default class App extends React.PureComponent {
  state = {
    winWidth: 0,
    winHeight: 0,
  }

  constructor(props) {
    super(props)
    this.resize = this.resize.bind(this)
  }

  resize() {
    const docEl = document.documentElement
    this.setState({
      winWidth: docEl.offsetWidth,
      winHeight: docEl.offsetHeight,
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
    return (
      <Home winHeight={this.state.winHeight} winWidth={this.state.winWidth} />
    )
  }
}
