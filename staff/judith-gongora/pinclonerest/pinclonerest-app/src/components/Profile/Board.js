import React, { Component } from 'react'
import './Profile.sass'
import logic from '../../logic'

class Board extends Component {
    state = { board: this.props.board, collage: [] }

    componentDidMount() {
        logic.retrieveCover(this.props.userId, this.props.board.id)
            .then(collage => this.setState({ collage }))
    }

    componentWillReceiveProps(props){
        this.setState({board: props.board}, ()=> logic.retrieveCover(this.props.userId, this.props.board.id)
        .then(collage => this.setState({ collage })))
    }

    handleOpenEditBoard = () => {
        this.props.onOpenEditBoard(this.state.board)
    }

    handleOpenBoard = event => {
        event.preventDefault()
        this.props.onOpenBoard(this.state.board, this.props.username)
    }

    render() {
        return <div className='container__boards-gallery' onClick={this.handleOpenBoard} >

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
                <div className='icon-hover edit' onClick={event => { event.stopPropagation(); this.handleOpenEditBoard() }} >
                    <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                        <path d="M13.386 6.018l4.596 4.596L7.097 21.499 1 22.999l1.501-6.096L13.386 6.018zm8.662-4.066a3.248 3.248 0 0 1 0 4.596L19.75 8.848 15.154 4.25l2.298-2.299a3.248 3.248 0 0 1 4.596 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    }
}

export default Board
