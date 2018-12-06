import React from 'react';
import { RentalAssets } from './RentalAssets';
import './RentalDetailInfo.css'


export function RentalDetailInfo(props) {
  const rental = props.rental;

  return (
      <div className='rental'>
        {/* <h2 className={`rental-type ${rental.category}`}>{rentalType(rental.shared)} {rental.category}</h2> */}
        <div className="rental-owner">
          <img src={rental.user && rental.user.image} alt="owner"/>
          <p>{rental.user && rental.user.name}</p>
        </div>
        <h1 className='rental-title'>{rental.title}</h1>
        <h2 className='rental-city'>{rental.city}</h2>
        <div className='rental-room-info'>
          <span><i className='fa fa-bed'></i> {rental.bedrooms} guests</span>
        </div>
        <p className='rental-description'>
          {rental.description}
        </p>
        <hr></hr>
        <RentalAssets />
      </div>
    )
}
