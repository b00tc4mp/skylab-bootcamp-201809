import React, { Component } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import PinInfo from './components/PinInfo/PinInfo'
import AddPin from './components/AddPin/AddPin'
import Profile from './components/Profile/Profile'
import Error from './components/Error'
import Board from './components/Board/Board'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

class App extends Component {
    state = { error: null, post: false, profile: false, otherUser: false, search: false, pin: null, board: null, path: null }

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
        this.setState({ pin })
        this.props.history.push(`/pin/${pin.id}`)   
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

    handleProfile = () => {
        this.setState({path: 'profile'})
        this.props.history.push('/profile')
    }

    handleOpenBoard = board => {
        this.setState({board, path: 'board'})
        this.props.history.push(`/boards/${board.title}`)
    }

    handleGoHome = () => {
        this.setState({path: 'home'})
        this.props.history.push('/home')
    }
   
    handleBack = () => {
            switch(this.state.path){
                case 'board':
                    this.props.history.push(`/boards/${this.state.board.title}`)
                    break;
                case 'profile':
                    this.props.history.push('/profile')
                    break;
                default: 
                    this.props.history.push('/home')
                    break;   
            }
    }


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
                ? <Home onLogout={this.handleLogoutClick} onHandlePinInfo={this.handlePinInfo} onHandleAddPin={this.handleAddPin} onHandleProfile={this.handleProfile} onOpenBoard={this.handleOpenBoard}/>
                : <Redirect to="/" />}
            />

            <Route path="/pin/:id" render={props => logic.loggedIn
                ? <PinInfo onLogout={this.handleLogoutClick} onPinInfo={this.handlePinInfo} pinId={props.match.params.id} onHome={this.handleBack} onHandleAddPin={this.handleAddPin} onHandleProfile={this.handleProfile} onOpenBoard={this.handleOpenBoard}/>
                : <Redirect to="/home" />}
            />

            <Route path="/pin-builder" render={() => logic.loggedIn
                ? <AddPin onHome={this.handleHome} onCreatePin={this.handleCreatePin} onHandleProfile={this.handleProfile}/>
                : <Redirect to="/home" />}
            />

            <Route path="/profile" render={() => logic.loggedIn
                ? <Profile onHome={this.handleGoHome} onLogout={this.handleLogoutClick} onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} onOpenBoard={this.handleOpenBoard} onHandleProfile={this.handleProfile}/>
                : <Redirect to="/home" />}
            />

            <Route path="/boards/:titleBoard" render={props => logic.loggedIn
                ? <Board onHome={this.handleGoHome} onLogout={this.handleLogoutClick} onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} boardTitle={props.match.params.titleBoard} onHandleProfile={this.handleProfile} onHandleProfile={this.handleProfile}/>
                : <Redirect to="/home" />}
            />



        </div>
    }
}

export default withRouter(App)
