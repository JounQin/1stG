import React from 'react'
import PropTypes from 'prop-types'

import styles from './grid.scss'

import { ExternalLink } from 'components/ExternalLink'
import github from 'assets/github.webp'
import githubFallback from 'assets/github.png'

const classNames = classes => classes.join(' ')

export const Grid = ({ title, text, link, className }) => (
  <ExternalLink
    href={link}
    className={classNames([styles.grid, styles[className]])}
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
  </ExternalLink>
)

Grid.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  link: PropTypes.string,
  className: PropTypes.string,
}
