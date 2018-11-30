import React, { Component } from 'react'
import './AddPin.sass'

class AddBoard extends Component {
    state = { boards: [], search: '', name: '', secret: false }

    handleInput = event => {
        const search = event.target.value
        this.setState({ search })
    }

    handleNameChange = event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleCheckChange = () => {
        if (this.state.secret === false) this.setState({ secret: true })
        else this.setState({ secret: false })
    }

    handleCreateBoard = event => {
        event.preventDefault()
        if(this.state.name) this.props.onCreateBoard(this.state.name, this.state.secret)   
    }

    handleSubmitSearch = event => {
        event.preventDefault()

        this.props.onSubmitShare(this.state.text)
        this.props.onClosePopup()

        this.setState({ text: '' })
    }

    render() {
        return <section className="container__addboard">
            <h3>Create board</h3>
            <div className="container__name">
                <span>Name</span>
                <input className="name__input" type="text" placeholder='Like "Places to Go" or "Recipes to Make"' onChange={this.handleNameChange} maxlength="15"></input>
            </div>
            <hr className='hr' />
            <div className='container__check'>
                <span>Secret</span>
                <div className={!this.state.secret ? 'container__secret' : 'container__secret-checked'}>
                    <input className='secret' type='checkbox' onChange={this.handleCheckChange}></input>
                    <div className={!this.state.secret ? 'checkbox' : 'checkbox-checked'}></div>
                </div>
            </div>
            <hr  className='hr'/>
            <div className='buttons__addboards'>
                <div onClick={this.props.onClose} className="themes add">
                    <span>Cancel</span>
                </div>

                <div className="themes add" onClick={this.handleCreateBoard}>
                    <span className={!this.state.name ? 'disable' : 'button-create'} >Create</span>
                </div>
            </div>
        </section>
    }
}

export default AddBoard