import React, { Component } from 'react'
import logic from '../../logic'
import Pin from '../Pin/Pin'
import PopUp from './PopUp'
import Navbar from '../Navbar/Navbar'
import './Home.css'

class Home extends Component {
    state = { pins: [], editPin: null, board: null }

    componentDidMount() {
        logic.listAllPins()
            .then(pins => this.setState({ pins }))
        // TODO error handling!

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

    handleSaveBoard = (pinId, boardId) => {
        logic.savePin(pinId, boardId)
            .then(() => this.setState({ board: null }))
    }


    render() {
        return <div className="div__home">
            <Navbar onHandleProfile={this.props.onHandleProfile} onLogout={this.props.onLogout} onHandleEditPin={this.handleEditPin} />
            {this.state.editPin && <PopUp key={this.state.editPin} id={this.state.editPin} pin={this.state.editPin} board={this.state.board} onCloseEditPin={this.handleCloseEditPin} onChangePin={this.handleChangePin} onEditPin={this.handleModifyPin} />}
            <section className="pins__container">
                {this.state.pins.map(pin => <Pin key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} />)}
            </section>
            <div className='add_pin' onClick={this.props.onHandleAddPin}>
                <svg height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                </svg>
            </div>
        </div>
    }
}

export default Home
