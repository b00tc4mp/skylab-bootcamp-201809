import React, { Component } from 'react'
import './Profile.sass'
import logic from '../../logic'

class Merge extends Component {
    state = { boards: [], search: [] }

    componentDidMount() {
        logic.listBoards()
            .then(boards => this.setState({ boards, search: boards }))
    }

    handleChangeInput = event => {
        const input = event.target.value
        if (!input.trim()) this.setState({ search: this.state.boards })
        else {
            const find = this.state.boards.filter(board => board.title.toLowerCase().includes(input.toLowerCase()))
            this.setState({ search: find })
        }

    }

    render() {
        return <section className="container__boards-merge">
            <div className='merge__head'>
                <h3>Move all Pins to... </h3>
                <div className='editBoard__close' >
                        <svg onClick={this.props.onCloseMerge} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                            <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                        </svg>
                    </div>
            </div>
            <form>
                <div className="search__group-boards merge">
                    <div className="search__icon-boards">
                        <i className="fas fa-search nav__icon"></i>
                    </div>
                    <div className="search__container-boards">
                        <input className="search__input-boards" type="text" placeholder="Search" onClick={event => event.stopPropagation()} onChange={this.handleChangeInput}></input>
                    </div>
                </div>
            </form>
            <ul className='list__board'>
                {this.state.search.map(board => (this.props.boardId !== board.id) && <li className='list__boards-item' id={board.id} onClick={() => this.props.onHandleMergeBoards(board.id)} > <span>{board.title} </span></li>)}
            </ul>

        </section>
    }
}

export default Merge