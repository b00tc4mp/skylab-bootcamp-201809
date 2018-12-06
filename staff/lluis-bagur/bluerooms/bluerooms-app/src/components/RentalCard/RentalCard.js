import React from 'react'
import './list.css'
import '.././RentalCardLanding/RentalCardLanding'
import '.././RentalCardSearch/RentalCardSearch'
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom'





export function RentalCard(props) {
    return (
        <div className='landingCard__rental'>
            <ToastContainer position="top-center" />
            <div className='img__landingCard'>
                <Link className='link' to={`/rental/${props.rental.id}`}><img className='card-img-top' src={props.rental.image} alt=''></img></Link>
            </div>

            <div className="landingCard__title"><h4 className='landingCard__title--text'> {props.rental.title}</h4></div>

            <div className='info__landingCard'>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><i class="fas fa-map-marker-alt"></i><p className="landingCard__city">&nbsp;{props.rental.city}</p></div>
                <div className="card_line"><h6 className='card__street'></h6><p className="card__text">{props.rental.street}</p></div>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><p className="landingCard__text">{props.rental.description}</p></div>


            </div>
            <div className='info__landingCard2'>
                <div className="landingCard_line"><h5 className='landingCard__bed'> </h5><p className="landingCard__text"> {props.rental.bedrooms}&nbsp;&nbsp;<h5 className="price_day"> GUESTS</h5></p></div>
                <div className="landingCard_line"><h5 className='landingCard__rate'> </h5><p className="landingCard__text"> {props.rental.dailyRate}$ <h5 className="price_day">NIGHT</h5></p></div>
                <div className="info__btns">

                    <div class="buttons">
                        <div class="button button-edit" onClick={() => props.onEditRental(props.rental.id)}>
                            <i class="fas fa-edit"></i>
                        </div>
                    </div>
                    {!props.rental.view && <div class="buttons">
                        <div class="button button-enable" onClick={() => props.onEnableRental(props.rental.id)}>
                        <i class="fas fa-eye"></i>
                        </div>
                    </div>}
                    {props.rental.view  &&<div class="buttons">
                        <div class="button button-remove" onClick={() => props.onDeleteRental(props.rental.id)}>
                        <i class="fas fa-eye-slash"></i>
                        </div>
                    </div>}
                </div>
            </div>

        </div>

    )
}

