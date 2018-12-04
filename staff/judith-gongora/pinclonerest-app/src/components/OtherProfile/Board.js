import React, { Component } from 'react'
import './Profile.sass'
import logic from '../../logic'

class Board extends Component {
    state = { board: this.props.board, collage: [] }

    componentDidMount() {
        logic.retrieveCover(this.props.user.id, this.props.board.id)
            .then(collage => this.setState({ collage }))
    }

    handleOpenBoard = () => this.props.onOpenBoard(this.state.board)
    

    render() {
        return <div  className='container__boards-gallery' onClick={this.handleOpenBoard} > 
        
        <div className="div__board-profile-collage">
                <div>
                    <img className='cover' src={this.state.collage[0] ? this.state.collage[0] : this.state.board.cover}></img>
                    <img className='cover' src={this.state.collage[2] ? this.state.collage[2] : this.state.board.cover}></img>
                </div>
                <div>
                    <img className='cover' src={this.state.collage[1] ? this.state.collage[1] : this.state.board.cover}></img>
                    <img className='cover' src={this.state.collage[3] ? this.state.collage[3] : this.state.board.cover}></img>
                </div>
            </div>
            <div className='footer__board'>
                <div>
                    <p className='bold-title'>{this.state.board.title}</p>
                    <p>{this.state.board.pins.length} pins</p>
                </div>
            </div>
        </div>
    }
}

export default Board
