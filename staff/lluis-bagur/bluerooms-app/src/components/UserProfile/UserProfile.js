import React, { Component } from 'react'
import logic from '../../logic'
import { RentalCard } from '../RentalCard/RentalCard'
import AddRentals from '../AddRentals/AddRentals'
import EditRentals from '../EditRentals/EditRentals'
import { withRouter } from "react-router"
import './UserProfile.css'


class Profile extends Component {
    state = { user: "", rentalId: "", showRentals: false, showBookings: false, showAddRentals: false, showEditRentals: false }

    componentDidMount() {
        logic.retriveUser()
            .then(user => { this.setState({ user }) })
    }

    handleRentalList = () => {
        this.setState({ showBookings: false, showRentals: true })

    }

    handleBookingList = () => {
        this.setState({ showBookings: true, showRentals: false })
    }

    toggleModalAddRental() {
        this.setState({ showAddRentals: !this.state.showAddRentals })
        logic.retriveUser()
            .then(user => { this.setState({ user }) })
    }

    handleRemoveRental = id => {
debugger
        return logic.removeRental(id)
            .then(() => this.handleRentalList())
            .then(() => logic.retriveUser())
            .then(user => { this.setState({ user }) })

    }

    handleEditRental = (id) => {
        this.setState({ showEditRentals: !this.state.showEditRentals, rentalId: id })
        logic.retriveUser()
            .then(user => { this.setState({ user }) })
    }

    handleGoBack = () => this.props.history.push('/')


    render() {

        return <div className="profile__page">
            <div className="user__background">
                <div className="user__profile">
                    <div className="profile__image">
                    </div>
                    <div className="profile__info">
                        <div className="profile__title"><h2>{this.state.user.name}</h2></div>
                    </div>
                    <div className="profile__buttons">
                        <div class="buttons">
                            <div class="button button-rent" onClick={() => this.handleRentalList()}>
                                <i class="fas fa-home"></i>
                            </div>
                        </div>
                        <div class="buttons">
                            <div class="button button-booking" onClick={() => this.handleBookingList()}>
                                <i class="fas fa-clipboard-list"></i>
                            </div>
                        </div>
                        <div class="buttons">
                            <div class="button button-back" >
                                {/* <a href="#" onClick={this.props.onGoBack}></a> */}
                                <i class="fas fa-times-circle"></i>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="user__menu">

                {this.state.showRentals && <div className="user__rentals">
                    {this.state.user.rentals.map((rental) => { return <RentalCard rental={rental} onDeleteRental={this.handleRemoveRental} onEditRental={this.handleEditRental} onRentalCardClick={this.handleRentalCardClick} /> })}
                    <div class="buttons">
                        <div class="button button-add" onClick={() => this.toggleModalAddRental()}>
                        <i class="fas fa-plus"></i>
                        </div>
                    </div>
                    <AddRentals showModal={this.state.showAddRentals} onShowHideModal={() => this.toggleModalAddRental()} />
                    {this.state.showEditRentals && <EditRentals id={this.state.rentalId} showModal={this.state.showEditRentals} onShowHideModal={() => this.handleEditRental()} />}

                </div>}

                {this.state.showBookings && <div className="user__rentals">
                    BOOKINGS
                    {/* {this.state.user.rentals.map((rental) => { return <RentalCard title={rental.title} city={rental.city} street={rental.street} category={rental.category} category={rental.category} bedrooms={rental.bedrooms} description={rental.description} dailyRate={rental.dailyRate} bookings={rental.bookings} key={rental.id} onRentalCardClick={this.handleRentalCardClick} /> })} */}
                </div>}
            </div>
        </div>
    }
}

export default withRouter(Profile)