import React, { Component } from 'react'
import logic from '../../logic'
import logo from '../../logo.png'
import './Navbar.sass'

class Navbar extends Component {
    state = {  user: null, search: '' }
        
    componentDidMount() {
       logic.retrieveUser()
       .then(user=> this.setState({user}))
    }

    componentWillReceiveProps(props){
        logic.retrieveUser()
       .then(user=> this.setState({user}))
    }

    handleSearchCahnge = event =>{
        const search = event.target.value
        this.setState({ search })
    }

    handleSubmit = () => {
        const s = this.state.search
        this.setState({search: ''}, this.props.onSearch(s))

    }
    
    render() {
    return this.state.user && <nav className="nav"><div className="logo" onClick={this.props.onHome}><img className ="logo__img" src={logo}/></div>
    <div className="search__group">
        <div className="search__icon"><i className="fas fa-search nav__icon"></i></div>
        <div className="search__container"><form onSubmit={this.handleSubmit} ><input className="search__input" type="text" placeholder="Search" onChange={this.handleSearchCahnge} value={this.state.search}></input></form></div>
    </div>
    <div className="icons__container">
        <div className="icon-hover-img" onClick={this.props.onHandleProfile} >
        <img src={this.state.user.img} ></img> <span> {this.state.user.username}</span>
        </div>
        <div className="icon-hover"> <i onClick={this.props.onSettings} className="fas fa-cog"></i></div>
        <div className="icon-hover"><i onClick={this.props.onLogout} className="fas fa-sign-out-alt"></i></div>
    </div>
    </nav>
    }
}

export default Navbar
