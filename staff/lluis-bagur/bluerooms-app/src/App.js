import React, { Component } from 'react'
import Error from './components/Error/Error'
import Landing from './components/Landing/Landing'
import logic from './logic'
import Navbar from './components/Navbar/Navbar'
import Profile from './components/UserProfile/UserProfile'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = 'http://localhost:5000/api' //poner en un .ENV, con la API KEY

class App extends Component {
    state = {
        error: null,
        loggedIn: false,
        name: sessionStorage.getItem('user.name') || '',
        user: ''
    }
    componentDidMount = () => {
        // logic.retriveRentals()
        //     .then(user => { this.setState({ user }) })
        
        const res = logic.loggedIn
        this.setState({ loggedIn: res })
    }

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
   

    handleProfileClick = () => {
        this.props.history.push('/user')
    }


    render() {
        const { error } = this.state

        return <div className="body">
            <Navbar onLogoClick={this.handleLogoClick} handleLoggedIn={this.handleLoggedIn} onRegisterClick={this.handleRegisterClick} isLoggedIn={this.state.loggedIn} onLogoutClick={this.handleLogoutClick} onProfileClick={this.handleProfileClick} name={this.state.name} />
            <Route exact path="/" render={() => <Landing isLoggedIn={this.state.loggedIn} />} />
            <Route exact path="/user" render={() => <Profile isLoggedIn={this.state.loggedIn} />} />
            {/* <Route exact path="/user-profile/:id/rentals/:id" render={()=> <Rental></Rental>}/> */}
            {error && <Error message={error} />}


            {/* <Route path="/postits" render={() => logic.loggedIn ? <div>
                <section><button onClick={this.handleLogoutClick}>Logout</button></section>
                <Postits />
            </div> : <Redirect to="/" />} /> */}

        </div>
    }
}

export default withRouter(App)
