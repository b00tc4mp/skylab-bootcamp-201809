import React, { Component } from 'react'
import logic from '../../logic'
import Pin from '../Pin/Pin'
import PopUp from './PopUp'
import Navbar from '../Navbar/Navbar'
import './Home.sass'

class Home extends Component {
    state = { pins: [], editPin: null, board: null, search: []}

    componentDidMount() {
        
        logic.listAllPins()
            .then(pins => {
                this.setState({ pins, search: pins }, ()=> {
                    if (this.props.search) {
                        const find = this.state.pins.filter(pin => pin.title.toLowerCase().includes(this.props.search.toLowerCase()))
                        this.setState({pins: find})
                    }
                })
                
            })
        // TODO error handling!

    }

    handlePinInfo = pin => {
        this.props.onHandlePinInfo(pin)
    }

    handleEditPin = (pin, board) => this.setState({ editPin: pin, board })

    handleCloseEditPin = () => this.setState({ editPin: null, board: null })

    handleChangePin = () => {
        this.setState({ editPin: null, board: null }, () =>
            logic.listAllPins()
                .then(pins => this.setState({ pins }))
        )
    }

    handleModifyPin = (pin, board, description) => {
        logic.modifyPinned(pin, board, description)
            .then(() => logic.listAllPins())
            .then(pins => this.setState({ pins, editPin: null, board: null }))
    }

    handleSaveBoard = (pinId, boardId) => {
        logic.savePin(pinId, boardId)
            .then(() => this.setState({ board: null }))
            .then(() => this.handleChangePin())
    }

    handleSearch = search => {
        if(search.trim()){ 
        const find = this.state.pins.filter(pin => {
           if (pin.title &&  pin.title.toLowerCase().includes(search.toLowerCase())) return pin 
        })
        this.setState({search: find})
        }else this.setState({search: this.state.pins})
    }

    handleHome = () =>{
        this.setState({search: this.state.pins})
    }


    render() {
        return <div className="div__home">
            <Navbar onSettings={this.props.onSettings} onHandleProfile={this.props.onHandleProfile} onLogout={this.props.onLogout} onHandleEditPin={this.handleEditPin} onSearch={this.handleSearch} onHome={this.handleHome} />
            {this.state.editPin && <PopUp key={this.state.editPin} id={this.state.editPin} pin={this.state.editPin} board={this.state.board} onCloseEditPin={this.handleCloseEditPin} onChangePin={this.handleChangePin} onEditPin={this.handleModifyPin} />}
            <section className="pins__container">
                {this.state.search.map(pin => <Pin key={pin.id} id={pin.id} pin={pin} onHandlePinInfo={this.handlePinInfo} onHandleEditPin={this.handleEditPin} onSavePin={this.handleSaveBoard} onChangePin={this.handleChangePin} onOpenBoard={this.props.onOpenBoard} />)}
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
