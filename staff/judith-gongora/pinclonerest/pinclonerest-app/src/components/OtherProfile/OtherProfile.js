import React, { Component } from 'react'
import logic from '../../logic'
import Board from './Board'
import Pin from '../Pin/Pin'
import './Profile.sass'

class OtherProfile extends Component {
    state = { user: '', pins: [], boards: [], tries: [], boardsSel: true, pinsSel: false, editBoard : null, editPin: null, board: null }

    componentDidMount() {
        
        Promise.all([logic.retrieveOtherUser(this.props.username), logic.listOtherBoards(this.props.username), logic.listOtherPins(this.props.username)])
            .then(([user, boards, pins]) => this.setState({ user, boards, pins }))

        // TODO error handling!

    }

    handleBoards = () => this.setState({ boardsSel: true, pinsSel: false, triesSel: false })

    handlePins = () => this.setState({ boardsSel: false, pinsSel: true, triesSel: false })

    handleTries = () => this.setState({ boardsSel: false, pinsSel: false, triesSel: true })

    handleCloseEditBoard = () => this.setState ({editBoard : null})

    handleEditBoard = board => this.setState({editBoard : board})
    
    handleModifyBoard = (boardId, title, secret, description, category) => {
        logic.modifyBoard(boardId, title, secret, description, category)
        .then(()=>logic.listBoards())
        .then(boards => this.setState({boards, editBoard: null}))
    }

    handleRemoveBoard = boardId => {
        logic.removeBoard(boardId)
        .then(()=> logic.listBoards())
        .then(boards => this.setState({boards, editBoard : null}))
    }

    handleSaveBoard = (pinId, boardId) => {
        logic.savePin(pinId, boardId)
            .then(() => this.setState({ board: null }))
    }

    handleOpenBoard = board => this.props.onOpenBoard(board, this.state.user.username)

    handlePinInfo = pin => this.props.onHandlePinInfo(pin)

    handleEditPin = (pin, board) => this.setState({ editPin: pin, board })

    handleCloseEditPin = () => this.setState({ editPin: null, board: null })

    handleChangePin = () => {
        logic.listAllPins()
            .then(pins => this.setState({ pins, editPin: null, board: null }))
    }

    handleModifyPin = (pin, board, description) => {
        logic.modifyPinned(pin, board, description)
            .then(() => logic.listAllPins())
            .then(pins => this.setState({ pins, editPin: null, board: null }))
    }

    handlePinInfo = pin => {
        this.props.onHandlePinInfo(pin)
    }

    render() {
        return <div className="div__profile">
            <div className='container__user'>
                <div className='other__profile'>
                    <h2>{this.state.user.username}</h2>
                    <p>{this.state.user.followers} followers · {this.state.user.following} following</p>
                </div>
                <img className='user__photo' src={this.state.user.img}></img>
            </div>
            <div className='navProfile'>
                <div className={this.state.boardsSel ? 'nav-title check' : 'nav-title'}>
                    <a onClick={this.handleBoards} >Boards</a>
                </div>
                <div className={this.state.pinsSel ? 'nav-title check' : 'nav-title'}>
                    <a onClick={this.handlePins} >Pins</a>
                </div>
            </div>
            {this.state.boardsSel && <section className="container__user-boards">
                {this.state.boards.map(board => <Board key={board.id} id={board.id} board={board} user={this.state.user} onOpenEditBoard={this.handleEditBoard} onOpenBoard={this.props.onOpenBoard} onOpenBoard={this.handleOpenBoard}/>)}
            </section>}
            {this.state.pinsSel && <section className="pins__container-profile">
                {this.state.pins.map(pin => <Pin key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} onOpenBoard={this.handleOpenBoard}/>)}
            </section>}

            <div className='add_pin' onClick={this.props.onHandleAddPin}>
                <svg height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                </svg>
            </div>
        </div>
    }
}

export default OtherProfile
