import React from 'react'
import './list.css'



export function RentalCard(props) {

    return (
        <div className='card__rental'>
            <div className='img__card'>
                <img className='card-img-top' src='http://via.placeholder.com/350x250' alt=''></img>
            </div>
            <div className='info__card'>
            
            <div className="card_line"><h4 className='card__title'> <i class="fas fa-home"></i>&nbsp; &nbsp; {props.title} &#183;</h4></div>
            <div className="card_line"><h6 className='card__city'><i class="fas fa-city"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.city}</p></div>
            <div className="card_line"><h6 className='card__street'><i class="fas fa-map-marker-alt"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.street}</p></div>
            <div className="card_line"><h6 className='card__dess'><i class="fas fa-info-circle"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.description}</p></div>
            </div>
            <div className='info__card2'>

                <div className="card_line"><h6 className='card__bed'><i className='fa fa-user'> </i> <i class="fas fa-bed"></i></h6><p className="card__text"> &nbsp; &nbsp;{props.bedrooms}</p></div>
                <div className="card_line"><h6 className='card__rate'><i class="fas fa-dollar-sign"></i> </h6><p className="card__text"> &nbsp; &nbsp;{props.dailyRate} /day</p></div>
                <a href='' className='card-link'>More Info</a>
            </div>
        </div>
    )
}

