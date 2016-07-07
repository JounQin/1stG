import React, {Component} from 'react';
import {Link} from 'react-router';
import classes from './HomeView.scss';

const body = document.body;
const html = body.parentElement;

export class HomeView extends Component {
  constructor(props) {
    super(props);
    HomeView.handleClick = HomeView.handleClick.bind(this);
    const getScale = () => Math.min(html.clientWidth / 1000, html.clientHeight / 750);
    this.state = {scale: getScale()};
    window.onresize = () => {
      this.setState({scale: getScale()});
    };
  }

  static handleClick(e) {
    e.preventDefault();
  }

  componentWillMount() {
    this.originalBodyClass = body.className.trim().replace(/\s+/g, ' ');
    body.className = this.originalBodyClass + ' ' + classes['wrap-bg'];
  }

  componentWillUnmount() {
    body.className = this.originalBodyClass;
    window.onresize = null;
  }

  render() {
    const transformPrefix = 'transform';
    const translate3d = `translate3d(-50%, -50%, 0) scale(${this.state.scale})`;
    const transform = {};
    ['Ms', 'Moz', 'O', 'Webkit', ''].forEach(value => {
      transform[value ? value + transformPrefix.replace(/^t/, 'T') : transformPrefix] = translate3d;
    });
    return (
      <nav className={classes['m-nav']} style={{transform: translate3d}}>
        <Link to="/animations" className="css mysite" onClick={HomeView.handleClick}>
          <div className="cont">
            <h2 className="title">Animations</h2>
            <span className="link-btn">
              {/* View Demo */}
            </span>
          </div>
          <span className="border border-t"/>
          <span className="border border-r"/>
          <span className="border border-b"/>
          <span className="border border-l"/>
          <span className="bg"/>
        </Link>
        <a href="http://blog.1stg.me" target="_blank" className="blog mysite">
          <div className="cont">
            <h2 className="title">My Blog</h2>
            <span className="link-btn">View Technology</span>
          </div>
          <span className="border border-t"/>
          <span className="border border-r"/>
          <span className="border border-b"/>
          <span className="border border-l"/>
          <span className="bg"/>
        </a>
        <Link to="/counter" className="lab mysite">
          <div className="cont">
            <h2 className="title">前端实验室</h2>
            <span className="link-btn">View Front-end Lab</span>
          </div>
          <span className="border border-t"/>
          <span className="border border-r"/>
          <span className="border border-b"/>
          <span className="border border-l"/>
          <span className="bg"/>
        </Link>
        <a href="https://github.com/JounQin" target="_blank" className="github">
          <div className="cont">
            <h2 className="title">GitHub</h2>
            <span className="link-btn">View</span>
          </div>
          <span className="border border-t"/>
          <span className="border border-r"/>
          <span className="border border-b"/>
          <span className="border border-l"/>
          <span className="bg"/>
        </a>
      </nav>
    );
  }
}

export default HomeView;
