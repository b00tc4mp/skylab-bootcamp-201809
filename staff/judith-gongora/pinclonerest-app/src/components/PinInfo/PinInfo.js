import React, { Component } from 'react'
import logic from '../../logic'
import './PinInfo.sass'
import Boards from './Boards'
import PopUp from './PopUp'
import Comments from './Comments'
import Send from './Send'
import AddBoard from '../Pin/AddBoard'

class PinInfo extends Component {
    state = { pin: null, comments: [], user: '', boards: false, board: '', following: false, createBoard: false, mine: false, send: false, editPin: false, description: '' }

    componentDidMount() {
        logic.retrievePin(this.props.pinId)
            .then(pin => { 
                Promise.all([logic.retrievePinUser(pin.user), logic.isPinned(pin.id), logic.isMine(pin.user), logic.retrieveComments(pin.id), logic.isFollowing(pin.user)])
                    .then(([user, board, mine, comments, following]) =>
                        this.setState({ pin, following, user, board, mine, comments })
                    )
            .then(()=> {
                if(this.state.board) logic.retrieveDescriptionPinned(this.props.pinId)
                            .then(description => this.setState({description}))
            })
                })
    }

    handlePinInfo = name => {
        this.props.onUserSearch(name)
    }

    handleAddPinned = board => {
        logic.AddPinned(board.id)
            .then(() => logic.isPinned(this.state.pin.id))
            .then(board => this.setState(board))
    }

    handleFollow = () => {
        if (!this.state.following) {
            logic.followUser(this.state.user.id)
                .then(() => logic.isFollowing(this.state.user.id))
                .then(following => this.setState({ following }))
                .then(() => logic.retrievePinUser(this.state.pin.user))
                .then(user => this.setState({ user }))

        } else {
            logic.unfollowUser(this.state.user.id)
                .then(() => logic.isFollowing(this.state.user.id))
                .then(following => this.setState({ following }))
                .then(() => logic.retrievePinUser(this.state.pin.user))
                .then(user => this.setState({ user }))
        }
    }

    handleClickThemes = () => {

        if (!this.state.boards) this.setState({ boards: true })
        else this.setState({ boards: false })
    }

    handleBoardChange = board => {
        logic.savePin(this.state.pin.id, board.id)
            .then(() => this.setState({ board, boards: false }))
            .then(() => logic.retrievePin(this.state.pin.id))
            .then(pin => this.setState({ pin }))
    }

    handleBoards = () => this.setState({ boards: true })

    handleBoardClose = () => {
        
        this.setState({ boards: false })
    }

    handleClickCreateBoard = () => this.setState({ createBoard: true })

    handleCloseEdit = () => this.setState({ boards: false, createBoard: false })

    handleCreateBoard = (title, secret) => {
        logic.addBoard(title, secret)
            .then(board => this.handleBoardChange(board))
            .then(() => this.setState({ createBoard: false }))
    }


    handleSend = () => {
        if (!this.state.send) this.setState({ send: true })
        else this.setState({ send: false })
    }

    handleComment = (comment) => {
        logic.addComment(this.state.pin.id, comment)
            .then(() => logic.retrieveComments(this.state.pin.id))
            .then(comments => this.setState({ comments }))

    }

    handleModifyPin = (pin, board, description) => {
        logic.modifyPinned(pin, board, description)
            .then(() => logic.isPinned(this.state.pin.id))
            .then(board => this.setState({ board, editPin: false }))
            .then(()=>logic.retrieveDescriptionPinned(this.props.pinId)
            .then(description => this.setState({description})))
    }

    handleEditPin = () => this.setState({ editPin: true })

    handleCloseEditPin = () => this.setState({ editPin: false })

    handleChangePin = () => {
        logic.isPinned(this.state.pin.id)
            .then(board => this.setState({ board, editPin: false }))
    }

    handleOpenBoard = () => this.props.onOpenBoard(this.state.board)

    handleLike = commentId => {
        logic.likeComment(this.state.pin.id, commentId)
        .then(()=>logic.retrieveComments(this.state.pin.id))
        .then(comments => this.setState({comments}))
    } 

    handleOtherProfile = () => this.props.onOtherProfile(this.state.user.username)

    render() {
        return this.state.pin && <div className="div__pinInfo">
            {this.state.editPin && <PopUp key={this.state.editPin} onDescription={this.state.description} id={this.state.editPin} pin={this.state.pin} board={this.state.board} onCloseEditPin={this.handleCloseEditPin} onChangePin={this.handleChangePin} onEditPin={this.handleModifyPin} />}
            <section className="pinInfo__container">
                <div className='pinInfo__home'>
                    <div onClick={this.props.onHome} >
                        <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66"></path></svg>
                        <span>Back</span>
                    </div>
                </div>
                <section className='info__container'>
                    <div>
                        <div className='container1'>
                            <div className='container2-info'>
                                <div className="themes" onClick={this.handleSend}>
                                    <svg height="16" width="16" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                        <path d="M21 14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2s2 .9 2 2v4h14v-4c0-1.1.9-2 2-2zM8.82 8.84c-.78.78-2.05.79-2.83 0-.78-.78-.79-2.04-.01-2.82L11.99 0l6.02 6.01c.78.78.79 2.05.01 2.83-.78.78-2.05.79-2.83 0l-1.2-1.19v6.18a2 2 0 1 1-4 0V7.66L8.82 8.84z"></path></svg>
                                    <span>Send</span>
                                </div>
                                {this.state.send && <Send id={this.state.pin.id} onBlur={this.handleSend} />}
                                {!this.state.board ? <div className='container__pinned'>
                                    <div className="themes1">
                                        <span>Boards</span>
                                        <svg onClick={this.handleClickThemes} height="12" width="12" viewBox="0 0 24 24" aria-label="Selecciona un tablero en el que quieras guardar Pines" role="img">
                                            <title>Select a board where you want to save Pins</title>
                                            <path d="M12 19.5L.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
                                        </svg>
                                    </div>
                                    <button className="button" type="submit" onClick={this.handleSubmit} >Save</button>
                                    {this.state.boards && <Boards handleSelectBoard={this.handleBoardChange} onCreateBoard={this.handleClickCreateBoard} onBlur={this.handleBoardClose} autoFocus />}
                                </div> :
                                    <div className='container__pinned underline' onClick={this.handleOpenBoard}>
                                        <p>Saved to <span className='bold'>{this.state.board.title}</span> </p>
                                        <div className='icon-hover' onClick={event=> {event.stopPropagation(); this.handleEditPin()}}>
                                            <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                                <path d="M13.386 6.018l4.596 4.596L7.097 21.499 1 22.999l1.501-6.096L13.386 6.018zm8.662-4.066a3.248 3.248 0 0 1 0 4.596L19.75 8.848 15.154 4.25l2.298-2.299a3.248 3.248 0 0 1 4.596 0z"></path>
                                            </svg>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                        <div className='container3'>
                            <img src={this.state.pin.multimedia} ></img>
                            <div className='container__left-info'>
                                {this.state.pin.url && <div className="themes2" onClick={event => { event.stopPropagation(); window.open(this.state.pin.url, "_blank") }}>
                                    <svg height="14" width="14" viewBox="0 0 24 24" aria-label="enlace" role="img"><path d="M4.9283,1 C3.6273,1 2.5713,2.054 2.5713,3.357 C2.5713,4.66 3.6273,5.714 4.9283,5.714 L14.9523,5.714 L1.6893,18.976 C0.7703,19.896 0.7703,21.389 1.6893,22.31 C2.1503,22.771 2.7533,23 3.3573,23 C3.9603,23 4.5633,22.771 5.0243,22.31 L18.2853,9.047 L18.2853,19.071 C18.2853,20.374 19.3413,21.429 20.6433,21.429 C21.9443,21.429 23.0003,20.374 23.0003,19.071 L23.0003,1 L4.9283,1 Z"></path></svg>
                                    <span>{this.state.pin.url}</span>
                                </div>}
                                {this.state.pin.description && <div><p>{this.state.pin.description}</p></div>}
                                <h3>{this.state.pin.title}</h3>
                                <div className='user__info'>
                                    <div className='user' onClick={!this.state.mine ? this.handleOtherProfile : this.props.onHandleProfile} >
                                        <img src={this.state.user.img} ></img>
                                        <div>
                                            <p className='username'>{this.state.user.username} </p>
                                            <p>{this.state.user.followers ? this.state.user.followers.length : 0} followers</p>
                                        </div>
                                    </div>
                                    {!this.state.following && !this.state.mine && <button className="button_f" type="submit" onClick={this.handleFollow} >Follow</button>}
                                    {this.state.following && !this.state.mine && <button className="button_u" type="submit" onClick={this.handleFollow} >Unfollow</button>}
                                </div>
                                <div className='comments__group'>
                                    <p className='title'>Comments</p>
                                    <Comments comments={this.state.comments} pinId={this.state.pin.id} onAddComment={this.handleComment} onLike={this.handleLike} />
                                    <div className='pinned'>
                                    {this.state.description && <div><span>Your Description</span> <p>{this.state.description}</p></div>}
                                        <svg height="16" width="16" viewBox="0 0 24 24" aria-label="Pin" role="img"><title>Pin</title><path d="M18 13.5c0-2.22-1.21-4.15-3-5.19V2.45A2.5 2.5 0 0 0 17 0H7a2.5 2.5 0 0 0 2 2.45v5.86c-1.79 1.04-3 2.97-3 5.19h5v8.46L12 24l1-2.04V13.5h5z"></path></svg>
                                        <span>{this.state.pin.pins ? this.state.pin.pins.length : 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>

                        </div>
                    </div>

                </section>
            </section>
            <div className='add_pin' onClick={this.props.onHandleAddPin}>
                <svg height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                </svg>
            </div>
            {this.state.createBoard && <AddBoard key={this.state.id} pin={this.state.pin} onCloseEditPin={this.handleCloseEdit} onCreateBoard={this.handleCreateBoard} />}
        </div>
    }
}

export default PinInfo