import React, { Component } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import PinInfo from './components/PinInfo/PinInfo'
import AddPin from './components/AddPin/AddPin'
import Profile from './components/Profile/Profile'
import Error from './components/Error'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

class App extends Component {
    state = { error: null, post: false, profile: false, otherUser: false, search: false, pin: null }

    handleLoginClick = () => this.props.history.push('/login')

    handleRegister = (email, password, age) => {
        try {
            logic.registerUser(email, password, age)
                .then(() => this.setState({ error: null }, () => this.props.history.push('/login')))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => this.setState({ error: null }, () => this.props.history.push('/home')))
                .catch(err => this.setState({ error: err.message }))
        } catch (err) {
            this.setState({ error: err.message })
        }
    }

    handleHome = () => {
        this.props.history.push('/home')
        this.setState({ pin: null })
    }

    handlePinInfo = pin => {
        this.props.history.push(`/pin/${pin.id}`)
        this.setState({ pin })
    }

    handleLogoutClick = () => {
        logic.logout()

        this.props.history.push('/login')
    }

    handleGoBack = () => this.props.history.push('/')

    handleErrorClose = () => {
        this.setState({ error: null })
    }

    handleAddPin = () => this.props.history.push('/pin-builder')


    handleCreatePin = (file, board, url, title, description) => {
        logic.createPin(file, board, url, title, description)
        .then(() => this.props.history.push('/home'))
    }

    handleProfile = () => this.props.history.push('/profile')

    handleGoHome = () => this.props.history.push('/home')
   



    render() {
        const { error} = this.state

        return <div>

            <Route exact path="/" render={() => !logic.loggedIn
                ? <Register onRegister={this.handleRegister} onGoBack={this.handleLoginClick} />
                : <Redirect to="/home" />}
            />

            <Route path="/login" render={() => !logic.loggedIn
                ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} />
                : <Redirect to="/home" />}
            />

            {error && <Error onErrorClose={this.handleErrorClose} message={error} />}

            <Route path="/home" render={() => logic.loggedIn
                ? <Home onLogout={this.handleLogoutClick} onHandlePinInfo={this.handlePinInfo} onHandleAddPin={this.handleAddPin} onHandleProfile={this.handleProfile}/>
                : <Redirect to="/" />}
            />

            <Route path="/pin/:id" render={() => logic.loggedIn
                ? <PinInfo onLogout={this.handleLogoutClick} onPinInfo={this.handlePinInfo} pin={this.state.pin} onHome={this.handleHome} />
                : <Redirect to="/home" />}
            />

            <Route path="/pin-builder" render={() => logic.loggedIn
                ? <AddPin onHome={this.handleHome} onCreatePin={this.handleCreatePin} />
                : <Redirect to="/home" />}
            />

            <Route path="/profile" render={() => logic.loggedIn
                ? <Profile onHome={this.handleGoHome} onLogout={this.handleLogoutClick} />
                : <Redirect to="/home" />}
            />


            

            {/* <Route path="/addpost" render={() => logic.loggedIn && post && !profile 
                ? <AddPost onLogout={this.handleLogoutClick} onProfile={this.handleProfile} onPost={this.handleAddPost} onGoBack={this.handleGoBack2} onSearch={this.handleSearch}/> 
                : <Redirect to="/home" />} 
            />

            <Route path="/profile" render={() =>logic.loggedIn && profile && !post 
                ? <Profile onLogout={this.handleLogoutClick} onPost={this.handlePost} onGoBack={this.handleGoBack2} onSearch={this.handleSearch}/> 
                : <Redirect to="/home" />} 
            />
            
            <Route path="/user/:id" render={ ()=>logic.loggedIn && !post && !profile && otherUser 
                ?  <OtherProfile onLogout={this.handleLogoutClick} onPost={this.handlePost} onGoBack={this.handleGoBack3} onGoHome={this.handleGoBack2} id={this.props.match.params.id} onInitialize={this.state.otherUser} onSearch={this.handleSearch}/> 
                : <Redirect to="/home"/>}/>
            
            <Route path="/search" render={() =>logic.loggedIn && !profile && !post && search 
                ? <Search onUserSearch={this.handleUserSearch} onLogout={this.handleLogoutClick} onPost={this.handlePost} onGoBack={this.handleGoBack2} onProfile={this.handleProfile}/> 
                : <Redirect to="/home" />} 
            /> */}

        </div>
    }
}

export default withRouter(App)
