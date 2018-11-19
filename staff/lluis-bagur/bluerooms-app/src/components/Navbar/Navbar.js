import React, { Component } from 'react'
import './Navbar.css'


class Navbar extends Component {

    state = {
        user: {},
        flagUser: false,
        name: ''
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


    render() {
        return <nav className="navbar">
            <div className="header">
                <div className="header__logo">
                    <div onClick={this.props.onLogoClick} className="img__logo" />
                </div>

                <div className="header__btns">
                    {!!this.props.name && <p>{'Welcome ' + this.props.name}</p>}
                    {this.props.isLoggedIn && <button className="header__btn" onClick={this.props.onLogoutClick}>Logout</button>}
                </div>
                {!this.props.isLoggedIn && <div className="header__btns">
                    <button type="button" className="header__btn" onClick={this.props.onLoginClick}>Login</button>
                    <button type="button"  className="header__btn" onClick={this.props.onRegisterClick}>Register</button>
                </div>}
            </div>

        </nav>
    }
}
    export default Navbar