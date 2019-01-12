import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from "react-router";
import logic from '../../logic'
import './Register.css'




class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', email: '', loggedIn: false, imgPreview: null, errorFile: false }

    componentWillReceiveProps(props) {
        this.setState({ modal: props.showModal })
    }

    toggle = () => {
        this.props.onShowHideModal()
    }

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

    handleChangeFile = event => {
        this.setState({ imgPreview: URL.createObjectURL(event.target.files[0]), file: event.target.files[0], errorFile: false })
    }

    handleRemovePreview = () => this.setState({ file: null, imgPreview: null })


    handleSubmit = event => {
        event.preventDefault()
        const { name, file, surname, username, password, email } = this.state

        if (!file) {
            this.setState({ errorFile: true })
            toast.warn('You need to upload a picture')
        }

        if (file) this.handleRegister(name, file, surname, username, password, email)
    }

    handleRegister = (name, file, surname, username, password, email) => {
        try {

            logic.registerUser(name, file, surname, username, password, email)
                .then(() => {
                    this.setState({ error: null, imgPreview: null })
                    // this.props.onShowHideModal()
                    toast.info('Now you can login!')
                    this.props.onShowLogin()
                })
                .catch(err => {
                    this.setState({ error: err.message }, () => toast.warn(err.message))
                })
        } catch (err) {
            this.setState({ error: err.message }, () => toast.warn(err.message))
        }
    }

    render() {
        return <div className="login__form">
            <ToastContainer position="top-center" />

            <Modal isOpen={this.state.modal} toggle={this.toggle} className="login-form">
                <ModalHeader toggle={this.toggle}>Register</ModalHeader>
                <ModalBody className="modal__body">
                    <form novalidate className="form__container" onSubmit={this.handleSubmit}>
                        <div className="header__logo">
                            <div className="img__logo" />
                        </div>
                        <input className="input__form" type="text" placeholder="Name" onChange={this.handleNameChange} />
                        <input className="input__form" type="text" placeholder="Surname" onChange={this.handleSurnameChange} />
                        <input className="input__form" type="email" placeholder="email" onChange={this.handleEmailChange} />
                        <input className="input__form" type="text" placeholder="Username" onChange={this.handleUsernameChange} />
                        <input className="input__form" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                        <div className="image__form">
                            {!this.state.imgPreview && <div>
                                <input id='file-form' className='input__file' type='file' onChange={this.handleChangeFile} />
                                <label for='file-form'>
                                    <div className={!this.state.errorFile ? 'add__photo' : 'add__photo error'}>
                                        <i className="fas fa-camera fa-2x"></i>
                                        Click to upload profile image
                                    </div>
                                </label>
                            </div>}

                            <div className='preview__container'>
                                <img className='photo__preview' src={this.state.imgPreview} ></img>
                                <div onClick={this.handleRemovePreview} className='icon_x'>
                                    <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                        <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <button className="form__btn" type="submit">Register</button>
                        <button className="form__btn" type="button" onClick={this.props.onShowLogin} >Or Login</button>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <button className="close__btn" onClick={this.toggle}>Close</button>
                </ModalFooter>
            </Modal>
        </div>
    }
}

export default withRouter(Register)