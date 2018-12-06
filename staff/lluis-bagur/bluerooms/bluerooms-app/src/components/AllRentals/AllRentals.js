import React, { Component } from 'react'
import logic from '../../logic'
import { RentalCardLanding } from '../RentalCardLanding/RentalCardLanding'


class AllRentals extends Component {
    state = {
        rentals: [],
    }

    componentDidMount() {
        logic.retriveRentals()
            .then(rentals => { this.setState({ rentals }) })
    }



    render() {
        return <div className="result__container">
            <div className="Result__title">
                <h2 className="title-h2">All rentals </h2>
            </div>
            <div className='container'>
                {this.state.rentals.map((rental) => { return <RentalCardLanding rental={rental} onBookRental={this.handleBookRental} /> })}
            </div>
        </div>

    }
}

export default AllRentals