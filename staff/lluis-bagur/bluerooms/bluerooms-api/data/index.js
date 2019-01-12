const mongoose = require('mongoose')

const { Booking, Rental, User } = require('./schemas')

module.exports = {
    Booking: mongoose.model('Booking', Booking),
    Rental: mongoose.model('Rental', Rental),
    User: mongoose.model('User', User)
}