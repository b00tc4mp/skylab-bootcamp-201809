import React, { Component } from 'react'
import './Pin.css'
import logic from '../../logic'

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
        if (this.state.name) this.props.onCreateBoard(this.state.name, this.state.secret)
    }

    handleSubmitSearch = event => {
        event.preventDefault()

        this.props.onSubmitShare(this.state.text)
        this.props.onClosePopup()

        this.setState({ text: '' })
    }

    render() {
        return <section className="container__addboard-pin">
            <div className='container__div'>

                <div className='container__title'>
                    <div className='title-addBoard'>
                        <h3>Create board</h3>
                    </div>
                    <div className='addBoard__close' >
                        <svg onClick={this.props.onCloseEditPin} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                            <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                        </svg>
                    </div>
                </div>
                <div className='container__body'>
                    <div>
                        <img src={this.props.pin.multimedia}></img>
                    </div>
                    <div className='new__board-inf'>
                        <div className="container__name">
                            <span>Name</span>
                            <input className="name__input" type="text" placeholder='Like "Places to Go" or "Recipes to Make"' onChange={this.handleNameChange}></input>
                        </div>
                        <hr className='hr' />
                        <div className='container__check'>
                            <span>Secret</span>
                            <div className={!this.state.secret ? 'container__secret' : 'container__secret-checked'}>
                                <input className='secret' type='checkbox' onChange={this.handleCheckChange}></input>
                                <div className={!this.state.secret ? 'checkbox' : 'checkbox-checked'}></div>
                            </div>
                        </div>
                        <hr className='hr' />
                        <div className='buttons__addboards'>
                            <div onClick={this.props.onClose} className="themes add">
                                <span>Cancel</span>
                            </div>

                            <div className="themes add" onClick={this.handleCreateBoard}>
                                <span className={!this.state.name ? 'disable' : 'button-create'} >Create</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default AddBoard