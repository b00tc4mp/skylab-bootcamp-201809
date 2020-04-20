import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logic from '../../logic'
import Search from '../Search/Search'
import { RentalCardSearch } from '../RentalCardSearch/RentalCardSearch'
import './SearchResults.css'


class SearchResults extends Component {
    state = {
        rentals: [],
        error: null,
    }

    componentDidMount() {
        this.searchRentals(this.props.query)
    }

    componentWillReceiveProps(props) {
        this.searchRentals(props.query)
    }

    searchRentals(query) {
        try {
            logic.searchRentals(query)
                .then(rentals => {
                    this.setState({ rentals })
                })
                .catch(err =>{ 
                this.setState({ error: err.message, rentals: null })
                toast.warn(this.state.error)
                })
            }
        catch (err) {
            this.setState({ error: err.message })
            toast.warn(this.state.error)
        }
    }

    handleRentalCardClick(id) {
        this.props.history.push(`/rental/${id}`)
    }


    render() {
        return <div className="contain__search">
                 <ToastContainer position="top-center" />

            <div className="contain__search__form">
                    <Search query={this.props.query} />
            </div>
            {this.state.rentals && <div className="contain__search__title">
                <h4>Your apartments in {this.props.query}:</h4>
            </div>}
            {this.state.rentals && <div className="contain__search__results">
                {this.state.rentals.map((rental) => {
                    return <RentalCardSearch id={rental.id} title={rental.title} city={rental.city} street={rental.street} category={rental.category} category={rental.category} bedrooms={rental.bedrooms} description={rental.description} image={rental.image} dailyRate={rental.dailyRate} bookings={rental.bookings} key={rental.id} onBookRental={this.handleRentalCardClick} />
                })}
            </div>}
        </div>
    }
}


export default withRouter(SearchResults)