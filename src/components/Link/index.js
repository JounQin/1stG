import React from 'react'
import {Link as RouterLink} from 'react-router'

export default class extends React.PureComponent {
  static propTypes = {to: React.PropTypes.string}

  render() {
    const {to, children, ...rest} = this.props
    return /^(https?:)?\/\//i.test(to) ? <a href={to} {...rest}>{children}</a> :
      <RouterLink to={to} {...rest}>{children}</RouterLink>
  }
}
