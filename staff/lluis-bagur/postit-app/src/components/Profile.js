import React, { Component } from 'react'
import logic from '../logic'


class Profile extends Component {
    state = { name: '', surname: '', newPassword: '', repeatNewPassword: '', password: '' }

    componentDidMount(){
        logic.listProfile()
            .then(profile =>  {
                 this.setState({ name : profile.name, surname : profile.surname}) })

    }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleNewPasswordChange = event => {
        const newPassword = event.target.value

        this.setState({ newPassword })
    }

    handleRepeatNewPasswordChange = event => {
        const repeatNewPassword = event.target.value

        this.setState({ repeatNewPassword })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, newPassword, repeatNewPassword, password } = this.state

        this.props.onUpdateProfile(name, surname, newPassword, repeatNewPassword, password)
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <label>Change your name or surname</label>
            <input type="text" defaultValue={this.state.name} onChange={this.handleNameChange} />
            <input type="text" defaultValue={this.state.surname} onChange={this.handleSurnameChange} />
            <label>Change your password</label>
            <input type="password" placeholder="New Password" onChange={this.handleNewPasswordChange} />
            <input type="password" placeholder="repeat New Password" onChange={this.handlerepeatNewPasswordChange} />
            <label>Current password to update changes</label>
            <input type="password" placeholder="Current password" onChange={this.handlePasswordChange} />
            <button type="submit">Update</button> <a href="#" onClick={this.props.onGoBack}>back</a>
        </form>
    }
}

export default Profile