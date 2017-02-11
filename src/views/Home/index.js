import React from 'react'

import Grid from './Grid'

import classes from './index.styl'

export default class extends React.PureComponent {
  render() {
    return <main className={classes.main}>
      {[{
        title: 'GitHub',
        link: 'https://github.com/JounQin',
        className: 'github'
      }, {
        title: 'Vue Ssr',
        text: 'View Demo',
        link: 'https://vue-ssr.1stg.me/',
        className: 'vue'
      }, {
        title: '奕起嗨',
        text: 'View EasyHi',
        link: 'https://hi.1stg.me',
        className: 'hi'
      }, {
        title: 'My Blog',
        text: 'View Technology',
        link: 'https://blog.1stg.me',
        className: 'blog'
      }].map((info, index) => <Grid key={index} info={info}/>)}
    </main>
  }
}
