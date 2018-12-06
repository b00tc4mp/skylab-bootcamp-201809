import React from 'react'
import './RentalCardLanding.css'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'




export function RentalCardLanding(props) {

    return (
        <div className='landingCard__rental'>
            <ToastContainer position="top-center" />
            <div className='img__landingCard'>
                <Link className='link' to={`/rental/${props.rental.id}`}><img className='card-img-top' src={props.rental.image} alt=''></img></Link>
            </div>

            <div className="landingCard__title"><h4 className='landingCard__title--text'> {props.rental.title}</h4></div>

            <div className='info__landingCard'>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><i class="fas fa-map-marker-alt"></i><p className="landingCard__city">&nbsp;{props.rental.city}</p></div>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><p className="landingCard__text">{props.rental.description}</p></div>


            </div>
            <div className='info__landingCard2'>

                <div className="landingCard_line"><Link className='link' to={`/rental/${props.rental.id}`}><button className='confirm__btn'>BOOKING</button></Link></div>
                <div className="landingCard_line">
                    <div className="landingCard_line"><h5 className='landingCard__bed'> </h5><p className="landingCard__text"> {props.rental.bedrooms}&nbsp;&nbsp;<h5 className="price_day"> GUESTS</h5></p></div>
                    <div className="landingCard_line"><h5 className='landingCard__rate'> </h5><p className="landingCard__text"> {props.rental.dailyRate}$ <h5 className="price_day">NIGHT</h5></p></div>
                </div>
            </div>


        </div>
    )
}

