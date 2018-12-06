import React, { Component } from 'react'
import logic from '../../logic'
import { RentalCard } from '../RentalCard/RentalCard'
import BookingList from '../BookingList/BookingList'
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
        return logic.removeRental(id)
            .then(() => this.handleRentalList())
            .then(() => logic.retriveUser())
            .then(user => { this.setState({ user }) })

    }

    handleEnableRental= id => {
        return logic.enableRental(id)
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
                    <img className="img" src={this.state.user && this.state.user.image} alt="owner"/>
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
                            <div class="button button-back" onClick={() => this.handleGoBack()}>
                            <i class="fas fa-undo-alt"></i>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="user__menu">

                {this.state.showRentals && <div className="user__rentals">
                    {this.state.user.rentals.map((rental) => { return <RentalCard rental={rental} onEnableRental={this.handleEnableRental} onDeleteRental={this.handleRemoveRental} onEditRental={this.handleEditRental} onRentalCardClick={this.handleRentalCardClick} /> })}
                    <div class="buttons">
                        <div class="button button-add" onClick={() => this.toggleModalAddRental()}>
                        <i class="fas fa-plus"></i>
                        </div>
                    </div>
                    <AddRentals showModal={this.state.showAddRentals} onShowHideModal={() => this.toggleModalAddRental()} />
                    {this.state.showEditRentals && <EditRentals id={this.state.rentalId} showModal={this.state.showEditRentals} onShowHideModal={() => this.handleEditRental()} />}

                </div>}

                {this.state.showBookings && <div className="user__rentals">
                    {this.state.user.bookings.map((booking) => { return <BookingList booking={booking} onBookingCardClick={this.handleBookingCardClick} /> })}
                </div>}
            </div>
        </div>
    }
}

export default withRouter(Profile)