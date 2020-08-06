import React, { Component } from 'react'
import logic from '../../logic'
import Board from './Board'
import PopUp from './PopUp'
import Pin from './Pin/Pin'
import './Profile.sass'
import EditBoard from './EditBoard';

class Profile extends Component {
    state = { user: '', pins: [], boards: [], tries: [], boardsSel: true, pinsSel: false, editBoard : null, editPin: null, board: null }

    componentDidMount() {
        Promise.all([logic.retrieveUser(), logic.listBoards(), logic.listUserPins()])
            .then(([user, boards, pins]) => {
                this.setState({ user, boards, pins })
            })

        // TODO error handling!

    }

    handleBoards = () => this.setState({ boardsSel: true, pinsSel: false, triesSel: false })

    handlePins = () => this.setState({ boardsSel: false, pinsSel: true, triesSel: false })

    handleTries = () => this.setState({ boardsSel: false, pinsSel: false, triesSel: true })

    handleCloseEditBoard = () => this.setState ({editBoard : null})

    handleCloseMerge = () => {
        logic.listBoards()
        .then(boards => this.setState ({editBoard : null, boards}))
        
    }

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

    handlePinInfo = pin => {
        this.props.onHandlePinInfo(pin)
    }

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
            {this.state.editPin && <PopUp key={this.state.editPin} id={this.state.editPin} pin={this.state.editPin} board={this.state.board} onCloseEditPin={this.handleCloseEditPin} onChangePin={this.handleChangePin} onEditPin={this.handleModifyPin} />}
            {this.state.editBoard && <EditBoard onHandleCloseMerge={this.handleCloseMerge} onCloseEditBoard={this.handleCloseEditBoard} board={this.state.editBoard} onEditBoard={this.handleModifyBoard} onDeleteBoard={this.handleRemoveBoard} />}
            <div className='container__user'>
                <div className='user__profile'>
                    <h2>{this.state.user.username}</h2>
                    <p onClick={this.props.onGoFollow} >{this.state.user.followers} followers · {this.state.user.following} following</p>
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
                {this.state.boards.map(board => <Board key={board.id} id={board.id} board={board} userId={this.state.user.id} onOpenEditBoard={this.handleEditBoard} onOpenBoard={this.props.onOpenBoard} username={this.state.user.username} />)}
            </section>}
            {this.state.pinsSel && <section className="pins__container-profile">
                {this.state.pins.map(pin => <Pin key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} />)}
            </section>}

            <div className='add_pin' onClick={this.props.onHandleAddPin}>
                <svg height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                </svg>
            </div>
        </div>
    }
}

export default Profile
