import React from 'react'
import PropTypes from 'prop-types'

import { Grid } from './Grid'
import styles from './index.scss'

import { ExternalLink } from 'components/ExternalLink'

const GRIDS = [
  {
    title: 'GitHub',
    link: 'https://github.com/JounQin',
    className: 'github',
  },
  {
    title: 'Rubick',
    text: 'Vue SSR + TS',
    link: 'https://rubick.1stg.me',
    className: 'rubick',
  },
  {
    title: 'React Hackernews',
    text: 'View React HN',
    link: 'https://react-hn.1stg.me',
    className: 'react-hn',
  },
  {
    title: 'My Blog',
    text: 'Personal Website',
    link: 'https://blog.1stg.me',
    className: 'blog',
  },
]

export const Home = () => (
  <main className={styles.main}>
    {GRIDS.map((info, index) => (
      <Grid key={index} {...info} />
    ))}
    <div className={styles.record}>
      <ExternalLink href="https://beian.miit.gov.cn">
        苏ICP备16035271号
      </ExternalLink>{' '}
      | Copyright 1992 - present JounQin. All Rights Reserved
    </div>
  </main>
)

Home.propTypes = {
  style: PropTypes.object,
}
