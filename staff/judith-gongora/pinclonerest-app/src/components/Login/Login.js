import React, {Component} from 'react'
import logo from '../../pinterest.svg'
import './Login.css'

class Login extends Component {
    state = { email: '', password: '' }

    handleemailChange = event => {
        const email = event.target.value

        this.setState({ email })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { email, password } = this.state

        this.props.onLogin(email, password)
    }

    render() {
        return <div className="login"> 
            <div className="login__page">
                <div className="group__login">
                    <div className="login__center">  
                        <div className="logo-l"><img className="logo__img-l" src={logo}></img> </div> 
                        <div><p className="welcome">Hello again!</p> </div> 
                        <form className="login__form" onSubmit={this.handleSubmit}>
                            <input type="email" placeholder="email" onChange={this.handleemailChange} required />
                            <input type="password" placeholder="Password" onChange={this.handlePasswordChange} required />
                            <button className="login__button" type="submit">Login</button> 
                        </form>
                        <div className="center"><p className="login__or">or</p></div> 
                        <button className="login__button login__button-google">Continue with google</button>
                        <a className="login__go center" href="#" onClick={this.props.onRegister}>Need an account? Register now.</a>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Login