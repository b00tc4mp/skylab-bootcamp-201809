import React, { Component } from 'react'
import {RentalCard} from '../RentalCard/RentalCard'


class RentalList extends React.Component {

    state = {
        rentals: [],
        error: null,
    }


    render() {
        return <div className="contain">
        <div className="row">
        <h4>Your Rental List:</h4>
            <div className="row__inner">
                {this.state.rentals.map((rental) => { return <RentalCard title={rental.title} city={rental.city} street={rental.street} category={rental.category} category={rental.category} bedrooms={rental.bedrooms} description={rental.description} dailyRate={rental.dailyRate} bookings={rental.bookings} key={rental.id} onRentalCardClick={this.handleRentalCardClick} />
                    
                })}
            </div>
        </div>
        </div>
    }

}export default RentalList