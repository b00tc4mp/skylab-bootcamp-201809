import React, {Component} from 'react'
import logo from '../../logo.png'
import './Login.sass'

class Login extends Component {
    state = { email: '', password: '', error: this.props.error, errorEmail: false }

    componentWillReceiveProps (props){
        this.setState({error: props.error})
    }

    handleemailChange = event => {
        const email = event.target.value
        this.setState({errorEmail: false})
        this.setState({ email, error: null })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password, error: null })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { email, password } = this.state
        if ( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) this.props.onLogin(email, password)
        else this.setState({errorEmail: true})
    }

    render() {
        return <div className="login"> 
            <div className="login__page">
                <div className="group__login">
                    <div className="login__center">  
                        <div className="logo-l"><img className="logo__img-l" src={logo}></img> </div> 
                        <div><p className="welcome">Hello again!</p> </div> 
                        <form className="login__form" onSubmit={this.handleSubmit}>
                            <input className={this.state.error || this.state.errorEmail ? 'error-red' : 'input-login'} type="text" placeholder="email" onChange={this.handleemailChange} />
                            <input className={this.state.error ? 'error-red' : 'input-login'} type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                            <button className="login__button" type="submit">Login</button> 
                        </form>
                        <a className="login__go center" href="#" onClick={this.props.onRegister}>Need an account? Register now.</a>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Login