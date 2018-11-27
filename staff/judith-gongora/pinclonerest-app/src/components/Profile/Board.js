import React, { Component } from 'react'
import './Profile.css'

class Board extends Component {
    state = { board: this.props.board, boardsEdit: false }

    handleEditBoards = () => this.setState({ boardsEdit: true })

    // handleBoard = () => this.props.onBoard


    render() {
        return <div  onClick='visitarBoard' className='container__boards-gallery'>

            <div className="div__board">
            <img src={this.state.board.cover} ></img>
            </div>
            <p className='bold-title'>{this.state.board.title}</p>
            <p>{this.state.board.pins.length} pins</p>

        </div>
    }
}

export default Board
