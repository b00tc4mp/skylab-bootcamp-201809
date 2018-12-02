import React, { Component } from 'react'
import logic from '../../logic'
import Navbar from '../Navbar/Navbar'
import Pin from '../Pin/Pin'
import PinUser from './Pin/PinUser'
import PopUp from './PopUp'
import EditBoard from '../Profile/EditBoard'
import './Board.sass'

class Board extends Component {
    state = { pins: [], editPin: null, board: null, boardEdit: null, editPin: null, editBoard: null, mine: false, user: null }

    componentDidMount() {
        this.getBoard(this.props.username, this.props.boardTitle)

        // TODO error handling!
    }

    componentWillReceiveProps(props){
        this.getBoard(props.username, props.boardTitle)
    }

    getBoard(username, boardTitle){
        logic.retrieveOtherUser(username)
            .then(user =>  this.setState({ user }))
            .then (()=> logic.isMine(this.state.user.id))
            .then(mine => this.setState({ mine }))
            .then(() => { 
                if (this.state.mine) logic.retrieveBoard(boardTitle)
                    .then(board => this.setState({ board }, () => logic.listBoardPins(this.state.board.id)
                        .then(pins => this.setState({ pins }))
                    ))
                else logic.retrieveOtherBoard(this.state.user.id, boardTitle)
                    .then(board => this.setState({ board }, () => logic.listOtherBoardPins(this.state.user.id, this.state.board.id)
                        .then(pins => this.setState({ pins }))
                    ))
            })
    }

    handleSaveBoard = (pinId, boardId) => {
        logic.savePin(pinId, boardId)
            .then(() => this.setState({ boardEdit: null }))
    }

    handlePinInfo = pin => {
        this.props.onHandlePinInfo(pin)
    }

    handleEditPin = (pin, board) => this.setState({ editPin: pin, boardEdit: board })


    handleCloseEditPin = () => this.setState({ editPin: null, boardEdit: null })

    handleChangePin = () => {
        logic.listBoardPins(this.state.board.id)
            .then(pins => this.setState({ pins, editPin: null, boardEdit: null }))
    }

    handleModifyPin = (pin, board, description) => {
        logic.modifyPinned(pin, board, description)
            .then(() => logic.listBoardPins(this.state.board.id))
            .then(pins => this.setState({ pins, editPin: null, boardEdit: null }))
    }

    handlePinInfo = pin => this.props.onHandlePinInfo(pin)


    // EDIT BOARD

    handleCloseEditBoard = () => this.setState({ editBoard: null })

    handleEditBoard = () => this.setState({ editBoard: this.state.board })

    handleModifyBoard = (boardId, title, secret, description, category) => {
        logic.modifyBoard(boardId, title, secret, description, category)
            .then(() => this.setState({ editBoard: null }, () => logic.retrieveBoard(title).then(board => this.setState({ board }))))
    }

    handleRemoveBoard = boardId => {
        logic.removeBoard(boardId)
            .then(() => this.props.onHandleProfile())
    }

    render() {
        return this.state.board && <div className="div__profile">
            <Navbar onSettings={this.props.onSettings} onHandleProfile={this.props.onHandleProfile} onHome={this.props.onHome} onLogout={this.props.onLogout} />
            {this.state.editBoard && <EditBoard onCloseEditBoard={this.handleCloseEditBoard} board={this.state.editBoard} onEditBoard={this.handleModifyBoard} onDeleteBoard={this.handleRemoveBoard} />}
            {this.state.editPin && <PopUp key={this.state.editPin} id={this.state.editPin} pin={this.state.editPin} board={this.state.board} onCloseEditPin={this.handleCloseEditPin} onChangePin={this.handleChangePin} onEditPin={this.handleModifyPin} />}
            <div className='container__head'>
                <div className='board__info'>
                    <div className='icons__board'>
                        <div className='icon-hover'>
                            <svg height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                <path d="M21 14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2s2 .9 2 2v4h14v-4c0-1.1.9-2 2-2zM8.82 8.84c-.78.78-2.05.79-2.83 0-.78-.78-.79-2.04-.01-2.82L11.99 0l6.02 6.01c.78.78.79 2.05.01 2.83-.78.78-2.05.79-2.83 0l-1.2-1.19v6.18a2 2 0 1 1-4 0V7.66L8.82 8.84z"></path>
                            </svg>
                        </div>
                        {this.state.mine && <div className='icon-hover' onClick={this.handleEditBoard} >
                            <svg height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                <path d="M13.386 6.018l4.596 4.596L7.097 21.499 1 22.999l1.501-6.096L13.386 6.018zm8.662-4.066a3.248 3.248 0 0 1 0 4.596L19.75 8.848 15.154 4.25l2.298-2.299a3.248 3.248 0 0 1 4.596 0z"></path>
                            </svg>
                        </div>}
                    </div>
                    <div className='container__user'>
                        <div className='user__profile'>
                            <h1>{this.state.board.title}</h1>
                            <p>{this.state.board.pins.length} pins</p>
                        </div>
                        <div>
                            <img src={this.state.user.img} ></img>
                        </div>
                    </div>
                </div>

            </div>
            <section className="pins__container-profile">
                {this.state.pins.map(pin => this.state.mine ? <PinUser key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} /> : <Pin key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} onOpenBoard={this.props.onOpenBoard}/>)}
            </section>

            <div className='add_pin' onClick={this.props.onHandleAddPin}>
                <svg height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                </svg>
            </div>
        </div>
    }
}

export default Board