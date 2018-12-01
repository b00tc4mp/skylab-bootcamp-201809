import React, { Component } from 'react'
import './Pin.sass'
import logic from '../../logic'


class Popup extends Component {
    state = { text: '', board: '' }

    componentDidMount() {
        logic.isPinned(this.props.id)
            .then(board => this.setState({ board }))
    }

    componentWillReceiveProps(props) {
        logic.isPinned(props.id)
            .then(board => this.setState({ board }))
    }

    handleInput = event => {
        const text = event.target.value
        this.setState({ text })
    }

    handleBoards = event => {
        event.stopPropagation()
        this.props.onHandleBoards()
    }

    handleEditPin = event => {
        event.stopPropagation()
        this.props.onHandleEditPin(this.state.board)
    }

    handleOpenBoard = () => this.props.onOpenBoard(this.state.board)

    render() {
        return <section className="popup">
            {!this.state.board ? <form className='form-top' >
                <div className="themes"><span>Boards</span><svg onClick={this.handleBoards} height="12" width="12" viewBox="0 0 24 24" aria-label="Selecciona un tablero en el que quieras guardar Pines" role="img"><title>Selecciona un tablero en el que quieras guardar Pines</title><path d="M12 19.5L.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path></svg></div>
                <button className="button" type="submit">Save</button>
            </form> :
                <div className='container__pinned-popup' onClick={event => {event.stopPropagation(); this.handleOpenBoard()}} >
                    <p>Saved to <span className='bold'>{this.state.board.title}</span> </p>
                    <div className='icon-hover-pin'>
                        <svg onClick={this.handleEditPin} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                            <path d="M13.386 6.018l4.596 4.596L7.097 21.499 1 22.999l1.501-6.096L13.386 6.018zm8.662-4.066a3.248 3.248 0 0 1 0 4.596L19.75 8.848 15.154 4.25l2.298-2.299a3.248 3.248 0 0 1 4.596 0z"></path>
                        </svg>
                    </div>
                </div>}
            <div className={this.props.url ? 'popup__links' : 'popup__link'}>
                {this.props.url && <div className="link__outside-pin" onClick={event => {event.stopPropagation(); window.open(this.props.url, "_blank")}} >
                    <svg height="14" width="14" viewBox="0 0 24 24" aria-label="enlace" role="img"><path d="M4.9283,1 C3.6273,1 2.5713,2.054 2.5713,3.357 C2.5713,4.66 3.6273,5.714 4.9283,5.714 L14.9523,5.714 L1.6893,18.976 C0.7703,19.896 0.7703,21.389 1.6893,22.31 C2.1503,22.771 2.7533,23 3.3573,23 C3.9603,23 4.5633,22.771 5.0243,22.31 L18.2853,9.047 L18.2853,19.071 C18.2853,20.374 19.3413,21.429 20.6433,21.429 C21.9443,21.429 23.0003,20.374 23.0003,19.071 L23.0003,1 L4.9283,1 Z"></path></svg>
                    <a>{this.props.url}</a>
                </div>}
                {/* <div className="link__share"><svg height="16" width="16" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><path d="M21 14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2s2 .9 2 2v4h14v-4c0-1.1.9-2 2-2zM8.82 8.84c-.78.78-2.05.79-2.83 0-.78-.78-.79-2.04-.01-2.82L11.99 0l6.02 6.01c.78.78.79 2.05.01 2.83-.78.78-2.05.79-2.83 0l-1.2-1.19v6.18a2 2 0 1 1-4 0V7.66L8.82 8.84z"></path></svg></div> */}
            </div>
        </section>
    }
}

export default Popup