import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Link from 'components/Link'

import classes from './grid.styl'

import github from './github.png'

export default withStyle(class extends React.PureComponent {
  static propTypes = {
    info: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
      link: PropTypes.string,
      className: PropTypes.string
    })
  }

  render() {
    const {title, text, link, className} = this.props.info
    return <Link to={link} className={classNames([classes.grid, classes[className]])} target="_blank">
      <div className={classNames([classes.border, classes.borderT])}/>
      <div className={classNames([classes.border, classes.borderR])}/>
      <div className={classNames([classes.border, classes.borderB])}/>
      <div className={classNames([classes.border, classes.borderL])}/>
      <div className={classes.content}>
        <div className={classes.wrapper}>
          {text ? '' : <img src={github}/>}
          <h2>{title}</h2>
          {text && <button className="btn">{text}</button>}
        </div>
      </div>
    </Link>
  }
}, classes)
