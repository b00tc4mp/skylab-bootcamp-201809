import React, { Component } from 'react'
import logic from '../../logic'
import { RentalCard } from '../RentalCard/RentalCard'
import AddRentals from '../AddRentals/AddRentals'
import { withRouter } from "react-router"
import './UserProfile.css'


class Profile extends Component {
    state = { user: "", showRentals: false, showBookings: false, showAddRentals: false }

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
    }



    render() {
        return <div className="profile__page">

            <div className="user__profile">
                <div className="profile__image">
                    FOTO
                </div>
                <div className="profile__info">
                    <form className="profile__form" onSubmit={this.handleSubmit}>
                        <div className="profile__form--title"><h1>Your profile</h1></div>
                        <div className="profile__form--info">
                            <div className="profile__form--label"><label>Name</label><input type='text' value={this.state.user.name} onChange={this.handleNameChange} disabled={this.state.edit}></input></div>
                            <div className="profile__form--label"><label>Surname</label><input type='text' value={this.state.user.surname} onChange={this.handleSurnameChange} disabled={this.state.edit}></input></div>
                            <div className="profile__form--label"><label>Email</label><input type='text' value={this.state.user.email} onChange={this.handleAddressChange} disabled={this.state.edit}></input></div>
                            {/* <button type='submit' disabled={this.state.edit}>Save Changes</button> */}
                        </div>
                    </form>
                    <button onClick={this.handleEditProfile}>Edit profile</button>
                </div>
            </div>
            <div className="user__menu">
                <div className="user__menu--buttons">
                    <button type="button" className="header__btn" onClick={() => this.handleRentalList()}>Your Rentals</button>
                    <button type="button" className="header__btn" onClick={() => this.handleBookingList()}>Your Bookings</button>
                </div>

                {this.state.showRentals && <div className="user__rentals">
                    {this.state.user.rentals.map((rental) => { return <RentalCard title={rental.title} city={rental.city} street={rental.street} category={rental.category} bedrooms={rental.bedrooms} description={rental.description} dailyRate={rental.dailyRate} bookings={rental.bookings} key={rental.id} onRentalCardClick={this.handleRentalCardClick} /> })}
                    <button type="button" className="header__btn" onClick={() => this.toggleModalAddRental()}>ADD NEW RENTAL</button>
                    
                        <AddRentals showModal={this.state.showAddRentals} onShowHideModal ={() => this.toggleModalAddRental()} />
                    
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