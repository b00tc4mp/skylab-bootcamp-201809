import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BookingList.css'
import { withRouter } from "react-router";
import logic from '../../logic'
import Moment from 'react-moment';



class BookingList extends Component {

    state = { rental: "" }

    componentDidMount(){

        logic.retriveRental(this.props.booking.rental)//...RETRIVE BY RENTAL ID
              .then(rental => {  
              this.setState({rental})
              
            })
    }
    
    render(){
    return (
        <div className='card__booking'>
            <div className='img__landingCard'>
                <Link className='link' to={`/rental/${this.state.rental.id}`}><img className='card-img-top' src={this.state.rental.image} alt=''></img></Link>
            </div>
            <div className="info__booking">
                <div className="card_line"><h6 className='card__street'> </h6><p className="card__text">Start at:&nbsp; &nbsp;<Moment format="YYYY/MM/DD">
                {this.props.booking.startAt}
            </Moment></p></div>
                <div className="card_line"><h6 className='card__dess'> </h6><p className="card__text">End At:&nbsp; &nbsp;<Moment format="YYYY/MM/DD">
                {this.props.booking.endAt}
            </Moment></p></div>
                <div className="card_line"><h6 className='card__dess'> </h6><p className="card__text">Total days:&nbsp; &nbsp;{this.props.booking.days}</p></div>
                <div className="card_line"><h6 className='card__dess'> </h6><p className="card__text">Total price:&nbsp; &nbsp;{this.props.booking.totalPrice}$</p></div>
                <div className="card_line"><h6 className='card__dess'> </h6><p className="card__text">Guests:&nbsp; &nbsp;{this.props.booking.guests}</p></div>
                <div className="card_line"><h6 className='card__dess'> </h6><p className="card__text">Rental title:&nbsp; &nbsp;{this.state.rental.title}</p></div>



            </div>

        </div>
    )
}

}

export default withRouter(BookingList)

