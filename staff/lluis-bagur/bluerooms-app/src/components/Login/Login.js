import React, { Component } from 'react'
import './Login.css'
import logic from '../../logic'
import { withRouter } from "react-router";


class Login extends Component {
    state = { username: '', password: '', error: null, loggedIn: false }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { username, password } = this.state

        this.handleLogin(username, password)
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => {
                    this.setState({ loggedIn: true })
                    this.props.toggle()
                    this.props.handleLoggedIn()
                })

                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div className="login__form">


            <form className="form__container" onSubmit={this.handleSubmit}>
                <div className="header__logo">
                    <div className="img__logo" />
                </div>
                <div className="form">
                <input className="input__form" type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                <input className="input__form" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                <button className="header__btn" type="submit">Login</button> 
                <button className="header__btn"  onClick={this.props.toggle}>back</button>
                </div>
            </form>
        </div>
    }
}

export default withRouter(Login)