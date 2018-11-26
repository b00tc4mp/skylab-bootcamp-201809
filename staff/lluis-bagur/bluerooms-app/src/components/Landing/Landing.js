import React from 'react'
import './Landing.css'
import Search from '../Search/Search'
import { RentalCard } from '../RentalCard/RentalCard'

// state = {
//     Rentals: ""
// }


class Landing extends React.Component {

    // componentDidMount() {
    //     logic.retriveRentals()
    //         .then(Rentals => { this.setState({ Rentals }) })
    // }

    render() {
        return <div className="home">
            <div className="search__container">
                <div className="search">
                    <Search />
                </div>
            </div>
            <div className="result__container">
            </div>
            <div className="results">
                <div className='container'>
                {/* {Rentals.map((rental) => { return <RentalCard rental={rental} onDeleteRental={this.handleRemoveRental} onEditRental={this.handleEditRental} onRentalCardClick={this.handleRentalCardClick} /> })} */}
                </div>

            </div>

        </div>
    }

}

export default Landing