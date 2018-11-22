import React, { Component } from 'react'
import { withRouter } from "react-router";
import logic from '../../logic'




class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', email: '', loggedIn: false }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, email } = this.state

        this.handleRegister(name, surname, username, password, email)
    }

    handleRegister = (name, surname, username, password, email) => {
        try {
            logic.registerUser(name, surname, username, password, email)
                .then(() => {
                    this.setState({ error: null })
                    this.props.toggle()
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
                <input className="input__form" type="text" placeholder="Name" onChange={this.handleNameChange} />
                <input className="input__form" type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                <input className="input__form" type="text" placeholder="email" onChange={this.handleEmailChange} />
                <input className="input__form" type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                <input className="input__form" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                <button className="header__btn" type="submit">Register</button> <button className="header__btn" href="#" onClick={this.props.toggle}>back</button>
            </form>
        </div>
    }
}

export default withRouter(Register)