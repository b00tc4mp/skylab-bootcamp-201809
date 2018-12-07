import React, { Component } from 'react'
import './Settings.sass'
import logic from '../../logic'

class Settings extends Component {
    state = { user: null, name: '', surname: '', username: '', save: false, file: null, imgPreview: null, error: null }

    componentDidMount() {
        logic.retrieveUser()
            .then(user => this.setState({ user }))

        // TODO error handling!
    }

    handleChangeFile = event => {
        this.setState({ imgPreview: URL.createObjectURL(event.target.files[0]), file: event.target.files[0], save: true })
    }

    handleRemovePreview = () => this.setState({ file: null, imgPreview: null, save: false, error: null })

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name, save: true })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname, save: true })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username, save: true, error: null })
    }

    handleSaveSettings = () => {

        if (this.state.file) try {
            Promise.all([logic.updateUserPhoto(this.state.file), logic.updateUser(this.state.name, this.state.surname, this.state.username)])
                .then(() => logic.retrieveUser()
                    .then(user => this.setState({ user, save: false, file: null, imgPreview: null })))
                .then(() => this.props.onChange())
                    .catch(err => this.setState({ error: err.message }))
        } catch (err) { this.setState({ error: err.message }) }
        else try {
            logic.updateUser(this.state.name, this.state.surname, this.state.username)
            .then(() => logic.retrieveUser()
                .then(user => this.setState({ user, save: false })))
            .then(() => this.props.onChange())
            .catch(err => this.setState({ error: err.message }))
        } catch (err) { this.setState({ error: err.message }) }


    }

    render() {
        return this.state.user && <section className="container__settings">
            <div className='container__head'>
                <div className='container__user-settings'>
                    <div className='user__profile'>
                        <h2>{this.state.user.username}</h2>
                        <p>{this.state.user.followers} followers · {this.state.user.following} following</p>
                    </div>
                    <div className='container__photo'>
                        {!this.state.file ? <div>
                            <input id='file-form' className='input__file' type='file' onChange={this.handleChangeFile} required />
                            <label htmlFor='file-form'>
                                <img className='user__photo' src={this.state.user.img}></img>
                                <i className="fas fa-camera fa-2x"></i>
                            </label>
                        </div> :
                            <div className='preview__container-settings'>
                                <img className='user__photo' src={this.state.imgPreview}></img>
                                <div onClick={this.handleRemovePreview} className='icon-x'>
                                    <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                        <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                                    </svg>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
            <div className='settings__profile'>
                <div className='group1'>
                    <div className='group2'>
                        <label>Name</label>
                        <input type='text' onChange={this.handleNameChange} defaultValue={this.state.user.name} ></input>
                    </div>
                    <div className='group2'>
                        <label>Surname</label>
                        <input type='text' onChange={this.handleSurnameChange} defaultValue={this.state.user.surname}></input>
                    </div>
                    <div className='group2'>
                        <label>Username</label>
                        <input type='text' onChange={this.handleUsernameChange} defaultValue={this.state.user.username} ></input>
                    </div>
                    {this.state.error && <span className='error-settings'>{this.state.error}</span>}
                    <div className='buttons__settings'>
                        <div onClick={this.props.onClose} className="themes add">
                            <span>Cancel</span>
                        </div>

                        <div className="themes add" onClick={this.state.save ? this.handleSaveSettings : ''}>
                            <span className={!this.state.save ? 'disable' : 'button-create'} >Save</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default Settings