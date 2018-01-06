import React from 'react'
import PropTypes from 'prop-types'

export default class Link extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.any,
  }

  render() {
    const { to, children, ...rest } = this.props
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    )
  }
}
