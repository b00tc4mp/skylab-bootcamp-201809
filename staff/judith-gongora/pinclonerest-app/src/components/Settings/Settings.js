import React, { Component } from 'react'
import './Settings.sass'
import logic from '../../logic'
import Navbar from '../Navbar/Navbar'

class Settings extends Component {
    state = { user: null }

    componentDidMount() {
        logic.retrieveUser()
            .then(user => this.setState({ user }))

        // TODO error handling!

    }

    render() {
        return this.state.user && <section className="container__settings">
            <Navbar onSettings={this.props.onSettings} onHandleProfile={this.props.onHandleProfile} onLogout={this.props.onLogout} onHandleEditPin={this.handleEditPin} />
            <div className='container__head'>
                <div className='container__user'>
                    <div className='user__profile'>
                        <h2>{this.state.user.username}</h2>
                        <p>{this.state.user.followers} followers · {this.state.user.following} following</p>
                    </div>
                    <img className='user__photo' src={this.state.user.img}></img>
                </div>
            </div>
        </section>
    }
}

export default Settings