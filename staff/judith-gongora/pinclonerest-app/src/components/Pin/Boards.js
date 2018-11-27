import React, { Component } from 'react'
import './Pin.css'
import logic from '../../logic'

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

    handleAddBoard =()=> this.props.onAddBoard()

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
            <div onClick={event => {event.stopPropagation(); this.handleAddBoard()}} className='new__board-pin'>
                <svg  height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M17.75 13.25h-4.5v4.5a1.25 1.25 0 0 1-2.5 0v-4.5h-4.5a1.25 1.25 0 0 1 0-2.5h4.5v-4.5a1.25 1.25 0 0 1 2.5 0v4.5h4.5a1.25 1.25 0 0 1 0 2.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path></svg>
                <span>Create board</span>
            </div>
        </section>
    }
}

export default Boards