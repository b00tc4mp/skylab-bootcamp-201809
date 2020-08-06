import React, { Component } from 'react'
import './Pin.sass'
import logic from '../../../logic'

class Boards extends Component {
    state = { boards: [] }

    componentDidMount() {
        logic.listBoards()
            .then(boards => this.setState({ boards }))
    }

    handleInput = event => {
        const board = event.target.value

    }

    handleSavePin = boardId => { 
        this.props.onSave(boardId)
    }

    handleSubmit = event => {
        event.preventDefault()

        this.props.onSubmitShare(this.state.text)
        this.props.onClosePopup()

        this.setState({ text: '' })
    }

    render() {
        return <section className="container__boards-pin">
            <form onSubmit={this.handleSubmit}>
                <div className="search__group-boards-pin">
                    <div className="search__icon-boards">
                        <i className="fas fa-search nav__icon"></i>
                    </div>
                    <div className="search__container-boards">
                    <input className="search__input-boards" type="text" placeholder="Search"></input>
                    </div>
                </div>
            </form>
            <ul className='list__boards'>
            {this.state.boards.map(board => <li className='list__boards__item-pin' id={board.id} onClick={event => {event.stopPropagation(); this.handleSavePin(board.id)}} > {board.title} <button className="button-list-pin" type="submit" >Save</button></li> )}
            </ul>
        </section>
    }
}

export default Boards