import React, { Component } from 'react'
import logo from '../../pinterest.svg'
import './Register.css'

class Register extends Component {
    state = { email: '', age: '',  password: '' }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handleAgeChange = event => {
        const age = event.target.value

        this.setState({ age })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleLogin = event => {
        event.preventDefault()
        this.props.onGoBack()

    }

    handleSubmit = event => {
        event.preventDefault()

        const { email, password, age } = this.state

        this.props.onRegister(email, password, age)
    }

    render() {
        return <div className="register"> 
            <div className="register__page">
                <div className="group__register">
                    <div className="register__center">  
                        <div className="logo-l"><img className="logo__img-l" src={logo}></img> </div> 
                        <div><p className="welcome">Register to see more</p> </div>  
                        <div><p className="info">Access the best ideas with a free account</p> </div>      
                        <form className="register__form" onSubmit={this.handleSubmit}>
                            <input type="text" placeholder="email" onChange={this.handleEmailChange} />
                            {/* <input type="text" placeholder="password" onChange={this.handleSurnameChange} /> */}
                            
                            <input type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                            <input type="text" placeholder="age" onChange={this.handleAgeChange} />
                            <button className="register__button" type="submit">Continue</button> 
                        </form>
                        <div className="center"><p className="register__or">or</p></div> 
                        <button className="register__button register__button-google">Continue with google</button>
                        <p className="register__conditions">By continuing, you agree to Pinterest's Terms of Service, Privacy Policy and use of cookies.</p>
                        <a className="register__go center" href="#" onClick={this.handleLogin}>Already a member? Login here.</a>
                    </div>
                </div>
            </div>
            <div className="colum3">
                <div className="button__register-position"><button className="button__register" onClick={this.handleLogin}>Login</button></div>
                <div className="guide-position">
                    <div className="guide">
                        <p>Pinterest helps you find ideas to try.</p>
                        <button>how it works?</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Register