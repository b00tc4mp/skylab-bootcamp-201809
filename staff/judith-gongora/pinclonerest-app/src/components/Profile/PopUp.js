import React, { Component } from 'react'
import '../Pin/Pin.css'
// import Boards from './Boards'


class Popup extends Component {
    state = { text: '', buddies:[], themes: false }

    handleInput = event => {
        const text = event.target.value
        console.log(text)
        this.setState({ text })
    }

    handleBoards = () => this.setState({ themes: true })

    handleSubmit = event => {
        event.preventDefault()

        this.props.onSubmitShare(this.state.text)
        this.props.onClosePopup()

        this.setState({ text: '' })
    }

    render() {
        return <section className="popup">
            <div className={this.props.url ? 'popup__links' : 'popup__link'}>
                {this.props.url && <div className="link__outside">
                    <svg height="14" width="14" viewBox="0 0 24 24" aria-label="enlace" role="img"><path d="M4.9283,1 C3.6273,1 2.5713,2.054 2.5713,3.357 C2.5713,4.66 3.6273,5.714 4.9283,5.714 L14.9523,5.714 L1.6893,18.976 C0.7703,19.896 0.7703,21.389 1.6893,22.31 C2.1503,22.771 2.7533,23 3.3573,23 C3.9603,23 4.5633,22.771 5.0243,22.31 L18.2853,9.047 L18.2853,19.071 C18.2853,20.374 19.3413,21.429 20.6433,21.429 C21.9443,21.429 23.0003,20.374 23.0003,19.071 L23.0003,1 L4.9283,1 Z"></path></svg>
                    <a>{this.props.url}</a>
                </div>}
                <div className="link__share"><svg height="16" width="16" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><path d="M21 14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2s2 .9 2 2v4h14v-4c0-1.1.9-2 2-2zM8.82 8.84c-.78.78-2.05.79-2.83 0-.78-.78-.79-2.04-.01-2.82L11.99 0l6.02 6.01c.78.78.79 2.05.01 2.83-.78.78-2.05.79-2.83 0l-1.2-1.19v6.18a2 2 0 1 1-4 0V7.66L8.82 8.84z"></path></svg></div>
            </div>   
        </section>
    }
}

export default Popup