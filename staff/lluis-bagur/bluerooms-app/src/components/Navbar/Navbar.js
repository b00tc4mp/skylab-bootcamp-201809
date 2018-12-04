import React, { Component } from 'react'
import Login from '../Login/Login'
import Register from '../Register/Register'
import { withRouter } from "react-router"


import './Navbar.css'


class Navbar extends Component {

    state = {
        user: {},
        flagUser: false,
        name: '',
        showLogin:false,
        showRegister: false
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.userID !== prevProps.userID) {
            this.fetchData(this.props.userID);
        }
        if (this.props.name !== prevProps.name) {
            this.setState({ name: this.props.name })
        }
    }

    toggleModalLogin(){
        this.setState({ showLogin: !this.state.showLogin })
        
    }
    toggleModalRegister(){
        this.setState({ showRegister: !this.state.showRegister })
    }
    handleGoBack = () => this.props.history.push('/')


    render() {
        return <nav className="navbar">
            <div className="header">
                <div className="header__logo">
                    <div onClick={() => this.handleGoBack()} className="img__logo" />
                </div>

                <div className="header__btns">
                    {!!this.props.name && <p>{'Welcome ' + this.props.name}</p>}
                    {this.props.isLoggedIn && <button className="header__btn" onClick={this.props.onLogoutClick}>Logout</button>}
                    {this.props.isLoggedIn && <button className="header__btn" onClick={this.props.onProfileClick}>Profile</button>}

                </div>
                {!this.props.isLoggedIn && <div className="header__btns">
                    <button type="button" className="header__btn" onClick={() => this.toggleModalLogin()}>Login</button>
                    <button type="button"  className="header__btn" onClick={() => this.toggleModalRegister()}>Register</button>
                </div>}
            </div>
            
            <Login showModal={this.state.showLogin} onShowHideModal={() => this.toggleModalLogin()} handleLoggedIn={this.props.handleLoggedIn} onGoBack={this.handleGoBack}/>
          
            <Register showModal={this.state.showRegister} onShowHideModal={() => this.toggleModalRegister()} toggle={() =>this.toggleModalRegister()}/>
 

        </nav>
    }
}
export default withRouter(Navbar)
