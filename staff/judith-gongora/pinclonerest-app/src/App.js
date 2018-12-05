import React, { Component } from 'react'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import PinInfo from './components/PinInfo/PinInfo'
import AddPin from './components/AddPin/AddPin'
import Settings from './components/Settings/Settings'
import Profile from './components/Profile/Profile'
import OtherProfile from './components/OtherProfile/OtherProfile'
import Error from './components/Error'
import Board from './components/Board/Board'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Follow from './components/Follow/Follow'

class App extends Component {
    state = { errorLogin: null, errorRegister: null, board: null, path: null, username: null, search: null, change: 0, errorPhoto: null}

    handleLoginClick = () => this.props.history.push('/login')

    handleRegister = (email, password, age) => {
        try {
            logic.registerUser(email, password, age)
                .then(() => this.setState({ errorRegister: null }, () => this.props.history.push('/login')))
                .catch(err => this.setState({ errorRegister: err.message }))
        } catch (err) {
            this.setState({ errorRegister: err.message })
        }
    }

    handleLogin = (username, password) => {
        try {
            logic.login(username, password)
                .then(() => this.setState({ errorLogin: null }, () => this.props.history.push('/home')))
                .catch(err => this.setState({ errorLogin: err.message }))
        } catch (err) {
            this.setState({ errorLogin: err.message })
        }
    }

    handleHome = () => {
        this.setState({ pin: null, search: null }, ()=> this.props.history.push('/home'))
        
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

    handleSettings = () => this.props.history.push('/settings')


    handleCreatePin = (file, board, url, title, description) => {
        try{
            logic.createPin(file, board, url, title, description)
            .then(() => {
                this.setState({errorPhoto: null}) 
                this.props.history.push('/home')
            })
            .catch(err => this.setState({ errorPhoto: err.message }))
        }catch(err){this.setState({ errorPhoto: err.message })}
    }

    handleProfile = () => {
        this.setState({path: 'profile'})
        this.props.history.push('/profile')
    }

    handleOpenBoard = (board, username) => {
        
        if(!username) {
            logic.retrieveUser()
            .then(user => {
                this.props.history.push(`/${user.username}/board/${board.title}`)
                this.setState({board, path: 'board', username: user.username})
            })
        }
        else {
            this.props.history.push(`/${username}/board/${board.title}`)
            this.setState({board, path: 'board', username})
        }

    }

    handleGoHome = () => {
        this.setState({path: 'home'})
        this.props.history.push('/home')
    }

    handleOtherProfile = username => {
        this.setState({path: username})
        this.props.history.push(`/user/${username}`)
    }

    handleSearch = search => {
        this.setState({path: 'home', search})
        this.props.history.push('/home')
    }

    handleFollow = () =>  this.props.history.push('/profile/follow')

    handleChangeSettings = () => this.setState({change: this.state.change + 1})
    
    handleBack = () => {
            switch(this.state.path){
                case 'board':
                    this.props.history.push(`/${this.state.username}/board/${this.state.board.title}`)
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
                ? <Register onRegister={this.handleRegister} onGoBack={this.handleLoginClick} error={this.state.errorRegister}/>
                : <Redirect to="/home" />}
            />

            <Route path="/login" render={() => !logic.loggedIn
                ? <Login onLogin={this.handleLogin} onGoBack={this.handleGoBack} error={this.state.errorLogin}/>
                : <Redirect to="/home" />}
            />

            {logic.loggedIn && <Navbar onSettings={this.handleSettings} onHandleProfile={this.handleProfile} onLogout={this.handleLogoutClick} onSearch={this.handleSearch} onHome={this.handleGoHome} onChange={this.state.change} />}
            
            {error && <Error onErrorClose={this.handleErrorClose} message={error} />}

            <Route path="/home" render={() => logic.loggedIn
                ? <Home onHandlePinInfo={this.handlePinInfo} onHandleAddPin={this.handleAddPin} onOpenBoard={this.handleOpenBoard}  search={this.state.search} />
                : <Redirect to="/" />}
            />

            <Route path="/settings" render={() => logic.loggedIn
                ? <Settings onLogout={this.handleLogoutClick} onHome={this.handleBack} onHandleProfile={this.handleProfile} onSettings={this.handleSettings} onChange={this.handleChangeSettings} />
                : <Redirect to="/home" />}
            />

            <Route path="/pin/:id" render={props => logic.loggedIn
                ? <PinInfo onLogout={this.handleLogoutClick} onPinInfo={this.handlePinInfo} pinId={props.match.params.id} onHome={this.handleBack} onHandleAddPin={this.handleAddPin} onHandleProfile={this.handleProfile} onSettings={this.handleSettings} onOpenBoard={this.handleOpenBoard}  onOtherProfile={this.handleOtherProfile}/>
                : <Redirect to="/home" />}
            />

            <Route path="/pin-builder" render={() => logic.loggedIn
                ? <AddPin onBack={this.handleBack} onCreatePin={this.handleCreatePin} errorPhoto={this.state.errorPhoto}/>
                : <Redirect to="/home" />}
            />

            <Route exact path="/profile" render={() => logic.loggedIn
                ? <Profile onGoFollow={this.handleFollow} onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} onOpenBoard={this.handleOpenBoard} />
                : <Redirect to="/home" />}
            />

             <Route path="/profile/follow" render={() => logic.loggedIn
                ? <Follow  onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} onOpenBoard={this.handleOpenBoard} onHandleOtherProfile={this.handleOtherProfile}/>
                : <Redirect to="/home" />}
            />

            <Route path="/user/:username" render={props => logic.loggedIn
                ? <OtherProfile onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} onOpenBoard={this.handleOpenBoard} username={props.match.params.username} />
                : <Redirect to="/home" />}
            />

            <Route path="/:username/board/:titleBoard" render={props => logic.loggedIn
                ? <Board onHandleAddPin={this.handleAddPin} onHandlePinInfo={this.handlePinInfo} boardTitle={props.match.params.titleBoard} username={props.match.params.username} onOpenBoard={this.handleOpenBoard} onHandleProfile={this.handleProfile}/>
                : <Redirect to="/home" />}
            />



        </div>
    }
}

export default withRouter(App)
