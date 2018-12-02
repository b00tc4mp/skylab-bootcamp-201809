import React, { Component } from 'react'
import logic from '../../logic'
import logo from '../../pinterest.svg'
import './Navbar.sass'

class Navbar extends Component {
    state = {  user: null }
        
    componentDidMount() {
       logic.retrieveUser()
       .then(user=> this.setState({user}))
    }
    
    
    render() {
    return this.state.user && <nav className="nav"><div className="logo" onClick={this.props.onHome}><img className ="logo__img" src={logo}/></div>
    <div className="search__group">
        <div className="search__icon"><i className="fas fa-search nav__icon"></i></div>
        <div className="search__container"><form><input className="search__input" type="text" placeholder="Search"></input></form></div>
    </div>
    <div className="icons__container">
        <div className="icon-hover-img" onClick={this.props.onHandleProfile} >
        <img src={this.state.user.img} ></img> <span> {this.state.user.username}</span>
        </div>
        <div className="icon-hover"> <i onClick={this.props.onSettings} className="fas fa-cog"></i></div>
        <div className="icon-hover"><svg onClick={this.props.onLogout} className ="nav__icon" height="22" width="22" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path></svg></div>
    </div>
    </nav>
    }
}

export default Navbar
