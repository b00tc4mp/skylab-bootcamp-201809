import React from 'react'
//import './BookingList.css'



export function BookingList(props) {

    return (
        <div className='card__booking'>

                <div className="card__title"><h4 className='card__title--text'> &nbsp; &nbsp; {props.booking.title}</h4></div>
                <div className="card_line"><h6 className='card__city'><i class="fas fa-city"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.booking.id}</p></div>
                <div className="card_line"><h6 className='card__street'><i class="fas fa-map-marker-alt"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.booking.startAt}</p></div>
                <div className="card_line"><h6 className='card__dess'><i class="fas fa-info-circle"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.booking.endAt}</p></div>
            <div className='info__card2'>

                <div className="card_line"><h6 className='card__bed'><i className='fa fa-user'> </i> </h6><p className="card__text"> &nbsp; &nbsp;{props.booking.rental}</p></div>
                <div className="card_line"><h6 className='card__rate'><i class="fas fa-dollar-sign"></i> </h6><p className="card__text"> &nbsp; &nbsp;{props.booking.user} </p></div>
            </div>

        </div>
    )
}

