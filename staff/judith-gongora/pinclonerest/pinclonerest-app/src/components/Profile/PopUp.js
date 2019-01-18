import React, { Component } from 'react'
import './Profile.sass'
import Boards from './Boards'
import logic from '../../logic'


class Popup extends Component {
    state = { description: '', board: this.props.board, pin: this.props.pin, popup: false }

    componentDidMount (){
        logic.retrieveDescriptionPinned(this.props.pin.id)
            .then(description => this.setState({description}))
    }

    handleInput = event => {
        const description = event.target.value
        this.setState({ description })
    }

    handlePopUpBoards = () => {
        this.setState({ popup: true })
    }

    handleBoardChange = board => {
        this.setState({ board, popup: false })
    }

    handleDelete = () => {
        logic.removePin(this.state.pin.id)
        .then(() => this.props.onChangePin())
    }

    handleEditPin = () => {
        this.props.onEditPin(this.state.pin.id, this.state.board.id, this.state.description)
    }

    render() {
        return <section className="popup__editPin">
            <div className='container__editPin'>
                <div className='editPin__head'>
                    <div className='editPin__title'><h2>Edit this Pin</h2></div>
                    <div className='editPin__close' >
                        <svg onClick={this.props.onCloseEditPin} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                            <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                        </svg>
                    </div>
                </div>
                <div className='container__editPin-info'>
                    <div className='editPin__info'>
                        {this.state.popup && <Boards key={this.props.pin.id} id={this.props.pin.id} handleSelectBoard={this.handleBoardChange} onSave={this.props.onSaveBoard}  />}
                        <div className='change__board'>
                            <p>Board</p>
                            <div className='select__board'>
                                <span>{this.state.board.title}</span>
                                <svg onClick={this.handlePopUpBoards} height="14" width="14" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                    <path d="M12 19.5L.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className='description__pin' onChange={this.handleInput} >
                            <p>Description</p>
                            <textarea value={this.state.description}></textarea>
                        </div>
                    </div>
                    <div className='pin__multimedia'>
                        <img src={this.state.pin.multimedia}></img>
                    </div>
                </div>
                <div className='footer__editPin'>
                    <div className='button-bottom__editPin' onClick={this.handleDelete} >Delete</div>
                    <div className='container__buttons'>
                        <div className='button-bottom__editPin' onClick={this.props.onCloseEditPin}>Cancel</div>
                        <div className='button-bottom__editPin red' onClick={this.handleEditPin}>Save</div>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default Popup