import React, { Component } from 'react'
import '../Profile/Profile.sass'
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


    handleSubmit = event => {
        event.preventDefault()

        this.props.onSubmitShare(this.state.text)
        this.props.onClosePopup()

        this.setState({ text: '' })
    }

    render() {
        return <section className="container__boards-editPin">
            <form onSubmit={this.handleSubmit}>
                <div className="search__group-boards">
                    <div className="search__icon-boards">
                        <i className="fas fa-search nav__icon"></i>
                    </div>
                    <div className="search__container-boards">
                    <input className="search__input-boards" type="text" placeholder="Search"></input>
                    </div>
                </div>
            </form>
            <ul className='list__board'>
            {this.state.boards.map(board => <li className='list__boards-item' id={board.id} onClick={() => this.props.handleSelectBoard(board)} > <span>{board.title} </span></li> )}
            </ul>
        </section>
    }
}

export default Boards