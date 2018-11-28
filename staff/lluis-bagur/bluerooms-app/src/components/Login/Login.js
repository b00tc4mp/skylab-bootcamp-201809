import React, { Component } from 'react'
import './Login.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logic from '../../logic'
import { withRouter } from "react-router";


class Login extends Component {
    state = { username: '', password: '', error: null, loggedIn: false }


    componentWillReceiveProps(props) {
        this.setState({ modal: props.showModal })
    }

    toggle = () => {
        this.props.onShowHideModal()
      }

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
                    this.props.onShowHideModal()
                    this.props.handleLoggedIn()
                })

                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <div className="login__form">

            <Modal isOpen={this.state.modal} toggle={this.toggle} className="login-form">
                <ModalHeader toggle={this.toggle}>Add a new rental</ModalHeader>
                <ModalBody>
                    <form className="form__container" onSubmit={this.handleSubmit}>
                        <div className="header__logo">
                            <div className="img__logo" />
                        </div>
                        <div className="form">
                            <input className="input__form" type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                            <input className="input__form" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                            <button className="form__btn" type="submit">Login</button>
                            <button className="form__btn" onClick={this.props.toggle}>back</button>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button onClick={this.toggle}>Close</button>
                </ModalFooter>
            </Modal>
        </div >
    }
}

export default withRouter(Login)