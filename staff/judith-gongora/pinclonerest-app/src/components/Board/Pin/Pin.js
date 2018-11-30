import React, { Component } from 'react'
import PopUp from './PopUp'
import './Pin.sass'



class Pin extends Component {

    handleEditPin = board => this.props.onHandleEditPin(this.props.pin, board)
    
    handlePinClick = () =>  this.props.onHandlePinInfo(this.props.pin)

    render() {
        return <article className="pin__container" onClick={this.handlePinClick}>
            <div className="pin">
                <div className="content">
                    <div className="img__container">
                        <img className="pin__img" src={this.props.pin.multimedia}></img>
                        <PopUp key={this.props.key} id={this.props.id} url={this.props.pin.url} onHandleEditPin={this.handleEditPin}  />
                    </div>
                    <p className="pin__title">{this.props.pin.title}</p>
                </div>
            </div>
        </article>
    }
}

export default Pin