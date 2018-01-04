import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Link from 'components/Link'

import { withSsr } from 'utils'

import styles from './grid.scss'

import github from 'assets/github.webp'
import githubFallback from 'assets/github.png'

const Grid = ({ title, text, link, className }) => (
  <Link
    to={link}
    className={classNames([styles.grid, styles[className]])}
    target="_blank"
  >
    <div className={classNames([styles.border, styles.borderT])} />
    <div className={classNames([styles.border, styles.borderR])} />
    <div className={classNames([styles.border, styles.borderB])} />
    <div className={classNames([styles.border, styles.borderL])} />
    <div className={styles.content}>
      <div className={styles.wrapper}>
        {text ? null : (
          <picture>
            <source srcSet={github} type="image/webp" />
            <source srcSet={githubFallback} type="image/jpeg" />
            <img src={githubFallback} alt="GitHub" />
          </picture>
        )}
        <h2>{title}</h2>
        {text && <button className="btn">{text}</button>}
      </div>
    </div>
  </Link>
)

Grid.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  link: PropTypes.string,
  className: PropTypes.string,
}

export default withSsr(styles)(Grid)
