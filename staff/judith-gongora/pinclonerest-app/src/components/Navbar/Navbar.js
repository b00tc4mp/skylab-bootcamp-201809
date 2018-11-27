import React from 'react'
import logo from '../../pinterest.svg'
import './Navbar.css'

function Navbar(props) {
    return <nav className="nav"><div className="logo" onClick={props.onHome}><img className ="logo__img" src={logo}/></div>
    <div className="search__group">
        <div className="search__icon"><i className="fas fa-search nav__icon"></i></div>
        <div className="search__container"><form><input className="search__input" type="text" placeholder="Search"></input></form></div>
    </div>
    <div className="icons__container">
        <div className="icon-hover"><svg onClick={props.onHandleProfile} className="nav__icon" height="22" width="22" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M8 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm10 3c3.314 0 6 2.713 6 6.061V22H0v-1.919C0 15.618 3.582 12 8 12c2.614 0 4.927 1.272 6.387 3.23A5.927 5.927 0 0 1 18 14zm0-1a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z"></path></svg></div>
        <div className="icon-hover"><i className="nav__icon fas fa-upload"></i></div>
        <div className="icon-hover"><svg className="nav__icon" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M18 12.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18 12.5m-6 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 12 12.5m-6 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 6 12.5M12 0C5.925 0 1 4.925 1 11c0 2.653.94 5.086 2.504 6.986L2 24l5.336-3.049A10.93 10.93 0 0 0 12 22c6.075 0 11-4.925 11-11S18.075 0 12 0"></path></svg></div>
        <div className="icon-hover"><svg className="nav__icon" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="#8e8e8e" d="M8 16c-1.12 0-2.03-.9-2.03-2h4.06c0 1.1-.91 2-2.03 2zm4.72-6.92c1.02.95 1.74 2.19 2.03 3.59H1.25c.29-1.4 1.01-2.64 2.02-3.59V4.67C3.27 2.09 5.39 0 8 0c2.61 0 4.72 2.09 4.72 4.67v4.41z"></path></svg></div>
        <div className="icon-hover"><svg onClick={props.onLogout} className ="nav__icon" height="22" width="22" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path></svg></div>
    </div>
    </nav>

}

export default Navbar
