import React, { Component } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Error from './components/Error/Error'
import Landing from './components/Landing/Landing'
import logic from './logic'
import Navbar from './components/Navbar/Navbar'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = 'http://localhost:5000/api'

class App extends Component {
    state = {
        error: null,
        loggedIn: false,
        name: sessionStorage.getItem('user.name') || '',
        user: ''
    }
    componentDidMount = () => {
        this.props.history.push('/')
        const res = logic.loggedIn
        this.setState({ loggedIn: res })
    }

    handleRegisterClick = () => this.props.history.push('/register')

    handleLoginClick = () => this.props.history.push('/login')

    handleLoggedIn = () => {
        this.setState({ loggedIn: true })
    }


    handleLogoutClick = () => {
        this.setState({ loggedIn: false })
        this.setState({ user: '' })
        this.setState({ name: null })
        logic.logout()
        this.props.history.push('/')
    }

    handleRegister = (name, surname, username, password, email) => {
        try {
            logic.registerUser(name, surname, username, password, email)
                .then(() => {
                    this.setState({ error: null }, () => this.props.history.push('/login'))
                })
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => this.setState({ loggedIn: true }, () => this.props.history.push('/')))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleGoBack = () => this.props.history.push('/')

    render() {
        const { error } = this.state

        return <div className="body">
            <Navbar onLogoClick={this.handleLogoClick} onLoginClick={this.handleLoginClick} onRegisterClick={this.handleRegisterClick} isLoggedIn={this.state.loggedIn} onLogoutClick={this.handleLogoutClick} name={this.state.name} />
            <Route exact path="/" render={() => <Landing isLoggedIn={this.state.loggedIn} />} />
            <Route path="/register" render={() => !logic.loggedIn ? <Register onRegister={this.handleRegister} onGoBack={this.handleGoBack} /> : <Redirect to="/" />} />
            <Route path="/login" render={() => !logic.loggedIn ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} /> : <Redirect to="/" name={this.state.user.name} />} />
            {error && <Error message={error} />}

            {/* <Route path="/postits" render={() => logic.loggedIn ? <div>
                <section><button onClick={this.handleLogoutClick}>Logout</button></section>
                <Postits />
            </div> : <Redirect to="/" />} /> */}

        </div>
    }
}

export default withRouter(App)
