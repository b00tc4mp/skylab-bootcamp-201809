import React, { Component } from 'react'
import './Profile.sass'
import logic from '../../logic'

class Boards extends Component {
    state = { boards: [], search: [] }

    componentDidMount() {
        logic.listBoards()
            .then(boards => this.setState({ boards }))
    }

    handleChangeInput = event => {
        const input = event.target.value
        if(!input.trim()) this.setState({search: this.state.boards})
        else{
            const find = this.state.boards.filter(board => board.title.toLowerCase().includes(input.toLowerCase()))
            this.setState({search: find})
        }
        
    }

    render() {
        return <section className="container__boards-editPin">
            <form>
                <div className="search__group-boards">
                    <div className="search__icon-boards">
                        <i className="fas fa-search nav__icon"></i>
                    </div>
                    <div className="search__container-boards">
                    <input className="search__input-boards" type="text" placeholder="Search" onClick={event => event.stopPropagation()} onChange={this.handleChangeInput}></input>
                    </div>
                </div>
            </form>
            <ul className='list__board'>
            {this.state.search.map(board => <li className='list__boards-item' id={board.id} onClick={() => this.props.handleSelectBoard(board)} > <span>{board.title} </span></li> )}
            </ul>
        </section>
    }
}

export default Boards