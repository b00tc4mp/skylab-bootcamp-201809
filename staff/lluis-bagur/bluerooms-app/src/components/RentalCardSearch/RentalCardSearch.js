import React from 'react'
import './RentalCardSearch.css'
import '.././RentalCardLanding/RentalCardLanding'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';




export function RentalCardSearch(props) {

    return (
        <div className='landingCard__rental'>
        <ToastContainer />
            <div className='img__landingCard'>
            <Link className='link' to={`/rental/${props.id}`}><img className='card-img-top' src={props.image} alt=''></img></Link>
            </div>
            
            <div className="landingCard__title"><h4 className='landingCard__title--text'> {props.title}</h4></div>

            <div className='info__landingCard'>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><i class="fas fa-map-marker-alt"></i><p className="landingCard__city">&nbsp;{props.city}</p></div>
                <div className="landingCard_line"><h4 className='landingCard__city'> </h4><p className="landingCard__text">{props.description}</p></div>


            </div>
            <div className='info__landingCard2'>
                <div className="landingCard_line"><h5 className='landingCard__bed'> </h5><p className="landingCard__text"> {props.bedrooms}&nbsp;&nbsp;<h5 className="price_day"> GUESTS</h5></p></div>
                <div className="landingCard_line"><h5 className='landingCard__rate'> </h5><p className="landingCard__text"> {props.dailyRate}$ <h5 className="price_day">NIGHT</h5></p></div>
            </div>
            

        </div>
        // <div className='landingCard__rental'>
        //     <div className='img__landingCard'>
        //     <Link to={`/rental/${props.id}`}><img className='card-img-top' src={props.image} alt=''></img></Link>
        //     </div>
            
        //     <div className="landingCard__title"><h4 className='landingCard__title--text'> &nbsp; &nbsp; {props.title}</h4></div>

        //     <div className='info__landingCard'>
        //         <div className="landingCard_line"><h6 className='landingCard__city'><i class="fas fa-city"></i> </h6><p className="landingCard__text">&nbsp; &nbsp;{props.city}</p></div>
        //         <div className="landingCard_line"><h6 className='landingCard__bed'><i className='fa fa-user'> </i> </h6><p className="landingCard__text"> &nbsp; &nbsp;{props.bedrooms}</p></div>

        //     </div>
        //     <div className='info__landingCard2'>

        //         <div className="landingCard_line"><h6 className='landingCard__rate'><i class="fas fa-dollar-sign"></i> </h6><p className="landingCard__text"> &nbsp; &nbsp;{props.dailyRate} /day</p></div>
        //     </div>
            

        // </div>
    )
}

