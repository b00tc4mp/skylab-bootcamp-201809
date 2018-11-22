const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Booking = new Schema({
    endAt: {
        type: Date,
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
    },
    days: {
        type: Number,
    },
    guests: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },

    rental: {
        type: ObjectId,
        ref: 'Rental'
    },

})

const Rental = new Schema({
    title: {
        type: String,
        required: true,
        max: [128, 'Too long, max is 128 characters'],
        unique: true
    },
    city: {
        type: String,
        required: true,
        lowercase: true
    },
    street: {
        type: String,
        required: true,
        min: [4, 'Too short, min is 4 characters']
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    image: {
        type: String,
        required: true
    },
    bedrooms: String,
    shared: Boolean,
    description: {
        type: String,
        required: true
    },
    dailyRate: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    bookings: [{
        type: ObjectId,
        ref: 'Booking'
    }]
});

const User = new Schema({
    name: {
        type: String,
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    surname: {
        type: String,
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    username: {
        type: String,
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true
    },
    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: true
    },
    email: {
        type: String,
        required: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'email is required',
    },
    rentals: [{
        type: ObjectId,
        ref: 'Rental'
    }],
    bookings: [{
        type: ObjectId,
        ref: 'Booking'
    }]
})

module.exports = {
    Booking,
    Rental,
    User
}

