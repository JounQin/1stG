import React, {Component} from 'react'
import {Link} from 'react-router'
import classes from './HomeView.scss'

const body = document.body

export class HomeView extends Component {
  constructor () {
    super()
    this.handlerClick = this.handlerClick.bind(this)
  }

  handlerClick (e) {
    e.preventDefault()
  }

  componentWillMount () {
    body.className = classes['wrap-bg']
  }

  componentWillUnmount () {
    body.className = ''
  }

  render () {
    return (
      <nav className={classes['m-nav']}>
        <Link to='/animations' className='css mysite' onClick={this.handlerClick}>
          <div className='cont'>
            <h2 className='title'>Animations</h2>
            <span className='link-btn'>
              {/* View Demo */}
            </span>
          </div>
          <span className='border border-t' />
          <span className='border border-r' />
          <span className='border border-b' />
          <span className='border border-l' />
          <span className='bg' />
        </Link>
        <a href='http://blog.1stg.me' target='_blank' className='blog mysite'>
          <div className='cont'>
            <h2 className='title'>My Blog</h2>
            <span className='link-btn'>View Technology</span>
          </div>
          <span className='border border-t' />
          <span className='border border-r' />
          <span className='border border-b' />
          <span className='border border-l' />
          <span className='bg' />
        </a>
        <Link to='/counter' className='lab mysite'>
          <div className='cont'>
            <h2 className='title'>前端实验室</h2>
            <span className='link-btn'>View Front-end Lab</span>
          </div>
          <span className='border border-t' />
          <span className='border border-r' />
          <span className='border border-b' />
          <span className='border border-l' />
          <span className='bg' />
        </Link>
        <a href='https://github.com/JounQin' target='_blank' className='github'>
          <div className='cont'>
            <h2 className='title'>GitHub</h2>
            <span className='link-btn'>View</span>
          </div>
          <span className='border border-t' />
          <span className='border border-r' />
          <span className='border border-b' />
          <span className='border border-l' />
          <span className='bg' />
        </a>
      </nav>
    )
  }

}

export default HomeView
