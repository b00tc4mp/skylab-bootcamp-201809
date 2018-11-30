import React, { Component } from 'react'
import logic from '../../logic'
import PopUp from './PopUp'
import AddBoard from './AddBoard'
import './Pin.sass'
import Boards from './Boards'


class Pin extends Component {
    state = { themes: false, addBoard: false }

    handlePinClick = () => this.props.onHandlePinInfo(this.props.pin)

    handleBoards = () => this.setState({ themes: true })

    handleSave = boardId => {
        logic.savePin(this.props.id, boardId)
            .then(() => this.setState({ themes: false }))
            .then(()=> this.props.onChangePin())
    }

    handleEditPin = board => this.props.onHandleEditPin(this.props.pin, board)

    handleSaveBoard = board => {
        this.props.onSavePin(this.props.id, board)
        this.setState({ themes: false })
    }

    handleAddBoard = () => this.setState({ addBoard: true })

    handleCloseEdit = () => this.setState({ addBoard: false, themes: false})

    handleCreateBoard = (title, secret) => {
        logic.addBoard(title, secret)
            .then(board => this.props.onSavePin(this.props.id, board.id))
            .then(()=>this.setState({ themes: false, addBoard: false }))
    }

    render() {
        return <article className="pin__container" onClick={this.handlePinClick}>
            {this.state.addBoard && <AddBoard key={this.props.id} pin={this.props.pin} onCloseEditPin={this.handleCloseEdit} onCreateBoard={this.handleCreateBoard} />}
            <div className="pin">
                <div className="content">
                    <div className="img__container">
                        <img className="pin__img" src={this.props.pin.multimedia}></img>
                        <PopUp key={this.props.key} id={this.props.id} url={this.props.pin.url} onHandleBoards={this.handleBoards} onHandleEditPin={this.handleEditPin} onSaveBoard={this.handleSaveBoard} onOpenBoard={this.props.onOpenBoard} />
                        {this.state.themes && <Boards onSave={this.handleSave} onAddBoard={this.handleAddBoard} />}
                    </div>
                    <p className="pin__title">{this.props.pin.title}</p>
                </div>
            </div>
        </article>
    }
}

export default Pin