import React from 'react'
import './RentalCardSearch.css'
import { Link } from 'react-router-dom'




export function RentalCardSearch(props) {

    return (
        <div className='landingCard__rental'>
            <div className='img__landingCard'>
            <Link to={`/rental/${props.id}`}><img className='card-img-top' src='http://via.placeholder.com/350x250' alt=''></img></Link>
            </div>
            
            <div className="landingCard__title"><h4 className='landingCard__title--text'> &nbsp; &nbsp; {props.title}</h4></div>

            <div className='info__landingCard'>
                <div className="landingCard_line"><h6 className='landingCard__city'><i class="fas fa-city"></i> </h6><p className="landingCard__text">&nbsp; &nbsp;{props.city}</p></div>
                <div className="landingCard_line"><h6 className='landingCard__bed'><i className='fa fa-user'> </i> </h6><p className="landingCard__text"> &nbsp; &nbsp;{props.bedrooms}</p></div>

            </div>
            <div className='info__landingCard2'>

                <div className="landingCard_line"><h6 className='landingCard__rate'><i class="fas fa-dollar-sign"></i> </h6><p className="landingCard__text"> &nbsp; &nbsp;{props.dailyRate} /day</p></div>
            </div>
            

        </div>
    )
}

