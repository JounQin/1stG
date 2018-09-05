import React from 'react'
import PropTypes from 'prop-types'

import Grid from './Grid'

import styles from './index.scss'

const Home = ({ style }) => (
  <main className={styles.main} style={style}>
    {[
      {
        title: 'GitHub',
        link: 'https://github.com/JounQin',
        className: 'github',
      },
      {
        title: 'Rubick',
        text: 'Vue SSR + TS',
        link: 'https://rubick.1stg.me/',
        className: 'rubick',
      },
      {
        title: 'React Hackernews',
        text: 'View React HN',
        link: 'https://react-hn.now.sh',
        className: 'react-hn',
      },
      {
        title: 'My Blog',
        text: 'Personal Website',
        link: 'https://blog.1stg.me',
        className: 'blog',
      },
    ].map((info, index) => (
      <Grid key={index} {...info} />
    ))}
  </main>
)

Home.propTypes = {
  style: PropTypes.object,
}

export default Home
