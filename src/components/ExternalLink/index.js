import PropTypes from 'prop-types'
import React from 'react'

export class ExternalLink extends React.PureComponent {
  static propTypes = {
    href: PropTypes.string,
    children: PropTypes.any,
  }

  render() {
    const { href, children, ...props } = this.props
    return (
      <a
        {...props}
        href={href || null}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
}
