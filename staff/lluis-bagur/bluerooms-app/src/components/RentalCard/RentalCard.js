import React from 'react'
import './list.css'



export function RentalCard(props) {

    return (
        <div className='card__rental'>
            <div className='img__card'>
                <img className='card-img-top' src='http://via.placeholder.com/350x250' alt=''></img>
            </div>
            <div className='info__card'>

                <div className="card__title"><h4 className='card__title--text'> &nbsp; &nbsp; {props.rental.title}</h4></div>
                <div className="card_line"><h6 className='card__city'><i class="fas fa-city"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.rental.city}</p></div>
                <div className="card_line"><h6 className='card__street'><i class="fas fa-map-marker-alt"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.rental.street}</p></div>
                <div className="card_line"><h6 className='card__dess'><i class="fas fa-info-circle"></i> </h6><p className="card__text">&nbsp; &nbsp;{props.rental.description}</p></div>
            </div>
            <div className='info__card2'>

                <div className="card_line"><h6 className='card__bed'><i className='fa fa-user'> </i> </h6><p className="card__text"> &nbsp; &nbsp;{props.rental.bedrooms}</p></div>
                <div className="card_line"><h6 className='card__rate'><i class="fas fa-dollar-sign"></i> </h6><p className="card__text"> &nbsp; &nbsp;{props.rental.dailyRate} /day</p></div>
            </div>
            <div className="info__btns">

                <div class="buttons">
                    <div class="button button-edit"onClick={() => props.onEditRental(props.rental.id)}>
                    <i class="fas fa-edit"></i>
                    </div>
                </div>
                <div class="buttons">
                    <div class="button button-remove" onClick={() => props.onDeleteRental(props.rental.id)}>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                </div>
            </div>

        </div>
    )
}

