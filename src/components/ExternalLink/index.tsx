import React from 'react'

export type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export class ExternalLink extends React.PureComponent<ExternalLinkProps> {
  override render() {
    const { href, children, ...props } = this.props
    return (
      <a
        {...props}
        href={href || undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
}
