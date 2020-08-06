import React, { Component } from 'react'
import logo from '../../logo.png'
import './Register.sass'

class Register extends Component {
    state = { email: '', age: '',  password: '', error: this.props.error, errorEmail: false }

    componentWillReceiveProps (props){
        this.setState({error: props.error})
    }

    handleEmailChange = event => {
        const email = event.target.value

        this.setState({ email, errorEmail: false, error: null })
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
        if ( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) this.props.onRegister(email, password, age)
        else this.setState({errorEmail: true})
        
    }

    render() {
        return <div className="register"> 
            <div className="register__page">
                <div className="group__register">
                    <div className="register__center">  
                        <div className="logo-l"><img className="logo__img-l" src={logo}></img> </div> 
                        <div><p className="welcome">Register to see more</p> </div>  
                        <div><p className="info__register">Access the best ideas with a free account</p> </div>      
                        <form className="register__form" onSubmit={this.handleSubmit}>
                            <input className={this.state.error || this.state.errorEmail ? 'error-red' : 'input-login'} type="text" placeholder="email" onChange={this.handleEmailChange} />
                            {this.state.error && <span className='errorRegister'>{this.state.error}</span>}
                            
                            <input className={this.state.error ? 'error-red' : 'input-login'} type="password" placeholder="Password" onChange={this.handlePasswordChange} required/>
                            <input className={this.state.error ? 'error-red' : 'input-login'} type='number' placeholder="age" onChange={this.handleAgeChange} min='1' required />
                            <button className="register__button" type="submit">Continue</button> 
                        </form>
                        <p className="register__conditions">By continuing, you agree to Pinclonerest's Terms of Service, Privacy Policy and use of cookies.</p>
                        <a className="register__go center" href="#" onClick={this.handleLogin}>Already a member? Login here.</a>
                    </div>
                </div>
            </div>
            <div className="colum3">
                <div className="button__register-position"><button className="button__register" onClick={this.handleLogin}>Login</button></div>
                <div className="guide-position">
                    <div className="guide">
                        <p>Pinclonerest helps you find ideas to try.</p>
                    
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Register