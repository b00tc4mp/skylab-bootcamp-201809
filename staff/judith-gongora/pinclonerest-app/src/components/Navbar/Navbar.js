import React from 'react'
import logo from '../../pinterest.svg'
import './Navbar.sass'

function Navbar(props) {
    return <nav className="nav"><div className="logo" onClick={props.onHome}><img className ="logo__img" src={logo}/></div>
    <div className="search__group">
        <div className="search__icon"><i className="fas fa-search nav__icon"></i></div>
        <div className="search__container"><form><input className="search__input" type="text" placeholder="Search"></input></form></div>
    </div>
    <div className="icons__container">
        <div className="icon-hover"><svg onClick={props.onHandleProfile} className="nav__icon" height="22" width="22" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M8 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm10 3c3.314 0 6 2.713 6 6.061V22H0v-1.919C0 15.618 3.582 12 8 12c2.614 0 4.927 1.272 6.387 3.23A5.927 5.927 0 0 1 18 14zm0-1a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5z"></path></svg></div>
        <div className="icon-hover"><svg onClick={props.onLogout} className ="nav__icon" height="22" width="22" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path></svg></div>
    </div>
    </nav>

}

export default Navbar
