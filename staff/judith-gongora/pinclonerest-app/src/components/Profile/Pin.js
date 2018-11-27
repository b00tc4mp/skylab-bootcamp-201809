import React, { Component } from 'react'
import PopUp from './PopUp'
import '../Pin/Pin.css'
  

class Pin extends Component {
    state = { popup: false }

    handlePinClick = () => {
        this.props.onHandlePinInfo(this.props.pin) 
    }


    render() {
        return <article className="pin__container" onClick={this.handlePinClick}>
                <div className="pin">
                <div className="content">
                <div className="img__container">
                <img className="pin__img" src={this.props.pin.multimedia}></img>
                <PopUp key={this.props.key} id={this.props.id} url={this.props.pin.url} />
                </div>
                <p className="pin__title">{this.props.pin.title}</p>
                </div> 
                </div>    
            </article>  
    }
}

export default Pin