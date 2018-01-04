import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

export default class Link extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.any,
  }

  render() {
    const { to, children, ...rest } = this.props
    return /^(https?:)?\/\//i.test(to) ? (
      <a href={to} {...rest}>
        {children}
      </a>
    ) : (
      <RouterLink to={to} {...rest}>
        {children}
      </RouterLink>
    )
  }
}
