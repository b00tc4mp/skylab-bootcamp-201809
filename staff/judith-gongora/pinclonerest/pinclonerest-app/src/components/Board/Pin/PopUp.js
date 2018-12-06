import React, { Component } from 'react'
import './Pin.sass'
import logic from '../../../logic'


class Popup extends Component {
    state = { text: '', board: '' }

    componentDidMount() {
        logic.isPinned(this.props.id)
            .then(board => this.setState({ board }))
    }

    handleEditPin = () => this.props.onHandleEditPin(this.state.board)

    render() {
        return <section className="popup">
            <div className='buttons__container-pin'>
            <div className='icon-hover-pin'>
                <svg onClick={event =>  {event.stopPropagation(); this.handleEditPin()}} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M13.386 6.018l4.596 4.596L7.097 21.499 1 22.999l1.501-6.096L13.386 6.018zm8.662-4.066a3.248 3.248 0 0 1 0 4.596L19.75 8.848 15.154 4.25l2.298-2.299a3.248 3.248 0 0 1 4.596 0z"></path>
                </svg>
            </div>
            </div>
            <div className={this.props.url ? 'popup__links' : 'popup__link'}>
                {this.props.url && <div className="link__outside" onClick={event => {event.stopPropagation(); window.open(this.props.url, "_blank")}}>
                    <svg height="14" width="14" viewBox="0 0 24 24" aria-label="enlace" role="img"><path d="M4.9283,1 C3.6273,1 2.5713,2.054 2.5713,3.357 C2.5713,4.66 3.6273,5.714 4.9283,5.714 L14.9523,5.714 L1.6893,18.976 C0.7703,19.896 0.7703,21.389 1.6893,22.31 C2.1503,22.771 2.7533,23 3.3573,23 C3.9603,23 4.5633,22.771 5.0243,22.31 L18.2853,9.047 L18.2853,19.071 C18.2853,20.374 19.3413,21.429 20.6433,21.429 C21.9443,21.429 23.0003,20.374 23.0003,19.071 L23.0003,1 L4.9283,1 Z"></path></svg>
                    <a>{this.props.url}</a>
                </div>}
            </div>
        </section>
    }
}

export default Popup