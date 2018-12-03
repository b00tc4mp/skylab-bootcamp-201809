const { User, Rental, Booking, Picture, ProfilePicture } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const moment = require('moment');
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name:'lluis09',
    api_key:'483753711391589',
    api_secret:'FpGiCT6wIAg3IJ9EyBZBbFyI9mc'
})

// ....................  USER LOGIC .....................//

const logic = {
    registerUser(filename, fileData, name, surname, username, password, email) { //REGISTER && TESTED
        validate([{ key: 'name', value: name, type: String }, { key: 'filename', value: filename, type: String }, { key: 'surname', value: surname, type: String }, { key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }, { key: 'email', value: email, type: String }])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            const image = await this.uploadCloudinary(filename, fileData)

            user = new User({ name, surname, username, password, email, image })

            await user.save()
        })()
    },

    authenticateUser(username, password) { //LOGIN - AUTHENTICATIONS && TESTED
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) { // RETRIEVE USER BY ID && TESTED
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean().populate('rentals').populate('bookings')

            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            debugger

            user.id = id

            const rentals = user.rentals
            rentals.forEach(rental => {
                rental.id = rental._id
                delete rental._id
                delete rental.__v

            });

            const bookings = user.bookings
            bookings.forEach(booking => {
                delete booking._id
                delete booking.__v

            });
            return user
        })()
    },

//........................... UPLOAD PHOTOS  .......................//


    uploadCloudinary(filename, data) {
        debugger
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, res) => {
                if (error) return reject(Error(`the file ${filename} could not be uploaded`));
                debugger
                resolve(res.secure_url)

            }).end(data)
        })
    },

    //........................... RENTAL LOGIC .......................//

    // ADD RENTAL && TESTED

    addRental(id, filename, fileData, title, city, street, category, bedrooms, shared, description, dailyRate) {
        validate([{ key: 'id', value: id, type: String },  { key: 'filename', value: filename, type: String }, { key: 'title', value: title, type: String }, { key: 'city', value: city, type: String }, { key: 'street', value: street, type: String }, { key: 'category', value: category, type: String }, { key: 'bedrooms', value: bedrooms, type: Number }, { key: 'shared', value: shared, type: Boolean }, { key: 'description', value: description, type: String }, { key: 'dailyRate', value: dailyRate, type: Number }])

        
        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const image = await this.uploadCloudinary(filename, fileData)

            rental = new Rental({ title, city, street, category, image, bedrooms, shared, description, dailyRate, user: user.id })
            await rental.save()

            user.rentals.push(rental)

            await user.save()

        })()
    },

    //UPDATE RENTAL

    updateRental(id, rentalId, title, city, street, category, image, bedrooms, shared, description, dailyRate) { // UPDATE USERS
        validate([{ key: 'id', value: id, type: String }, { key: 'rentalId', value: rentalId, type: String }, { key: 'title', value: title, type: String }, { key: 'city', value: city, type: String }, { key: 'street', value: street, type: String }, { key: 'category', value: category, type: String }, { key: 'image', value: image, type: String }, { key: 'bedrooms', value: bedrooms, type: Number }, { key: 'shared', value: shared, type: Boolean }, { key: 'description', value: description, type: String }, { key: 'dailyRate', value: dailyRate, type: Number }])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rental = await Rental.findById(rentalId)

            if (!rental) throw new NotFoundError(`Rental with id ${id} not found`)

            debugger

            title != null && (rental.title = title)
            city != null && (rental.city = city)
            street != null && (rental.street = street)
            category != null && (rental.category = category)
            image != null && (rental.image = image)
            bedrooms != null && (rental.bedrooms = bedrooms)
            shared != null && (rental.shared = shared)
            description != null && (rental.description = description)
            dailyRate != null && (rental.dailyRate = dailyRate)

            debugger

            await rental.save()
        })()
    },

    //LIST RENTAL BY ID'S

    retriveRentals() {
        return (async () => {
            const rentals = await Rental.find({}).lean()

            rentals.forEach(rental => {
                rental.id = rental._id
                delete rental._id
                delete rental.__v

            });

            return rentals
        })()
    },

    listRentalByUserId(id) {

        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, __v: 0 }).populate('rentals').populate('bookings').lean().exec()

            const rentals = user.rentals
            rentals.forEach(rental => {
                delete rental._id
                delete rental.__v

            });

            const bookings = user.bookings
            bookings.forEach(booking => {
                delete booking._id
                delete booking.__v

            });

            return user.rentals
        })()
    },

    listRentalByRentalId(id, rentalId) {

        validate([{ key: 'id', value: id, type: String },
        { key: 'rentalId', value: rentalId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id).populate('rentals').lean().exec()
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rental = await Rental.findById(rentalId, { '_id': 0, __v: 0 }).lean().exec()
            if (!rental) throw new NotFoundError(`rental with id ${rentalId} not found`)
            rental.id = rentalId

            return rental
        })()
    },

    listRentalByQuery(query) {

        validate([{ key: 'query', value: query, type: String }])

        const city = query
        const _query = city ? { city: city.toLowerCase() } : {};

        return (async () => {
            const rental = await Rental.find(_query, { __v: 0 }).lean()

            rental.forEach(rental => {
                rental.id = rental._id
                delete rental._id

            });
            if (!rental.length>0) throw new NotFoundError(`Not rentals found in ${query}`)
            debugger
            return rental
        })()
    },

    retriveRental(rentalId) {

        validate([{ key: 'rentalId', value: rentalId, type: String }])

        return (async () => {
            const rental = await Rental.findById(rentalId, { __v: 0 }).populate('bookings').populate('user').lean().exec()

            debugger
            rental.user.id = rental.user._id
            delete rental.user._id
            delete rental.user.__v

            rental.id = rental._id
            delete rental._id
            debugger

            return rental
        })()
    },

    //REMOVE

    removeRental(id, rentalId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'rentalId', value: rentalId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rentals = user.rentals

            const _rent = rentals.filter(_rental => _rental.toString() !== rentalId)

            user.rentals = _rent

            await user.save() // delete Rental ID form User.rentals

            const rental = await Rental.findById(rentalId)

            if (!rental) throw new NotFoundError(`rental with id ${rentalId} not found`)

            await rental.remove()

        })()
    },


    //........................... BOOKING LOGIC .......................//

    // ADD BOOKING

    addBooking(id, rentalId, endAt, startAt, totalPrice, days, guests) {
        validate([{ key: 'id', value: id, type: String },
        { key: 'rentalId', value: rentalId, type: String },
        { key: 'endAt', value: endAt, type: String },
        { key: 'startAt', value: startAt, type: String },
        { key: 'totalPrice', value: totalPrice, type: Number },
        { key: 'days', value: days, type: Number },
        { key: 'guests', value: guests, type: Number }])
        debugger

        return (async () => {

            const user = await User.findById(id)
            const booking = new Booking({ startAt, endAt, totalPrice, guests, days});
            debugger
            const foundRental = await Rental.findById(rentalId).populate('bookings')
            debugger

            if (foundRental.user.id === user.id) {
                throw Error ('Cannot create booking on your Rental!' )
             }

             debugger
            const valid = this.ValidBooking(booking, foundRental) 
            debugger
                if (valid == true){
                    booking.user = user._id;
                    booking.rental = foundRental._id;
                    foundRental.bookings.push(booking._id);
                    debugger

                    await User.update({ _id: user.id }, { $push: { bookings: booking } });

                    await booking.save()

                    await foundRental.save()

                    debugger
                    return booking
                } else {

                    throw Error ('Choosen dates are already taken!' )
                }
                })()
    },

    // CHECK DATES

    ValidBooking(proposedBooking, rental) {
        let valid = true;

        
        debugger
        if (rental.bookings && rental.bookings.length > 0) {
            debugger

            valid = rental.bookings.every(function (booking) {
                debugger
                const proposedStart = moment(proposedBooking.startAt)
                const proposedEnd = moment(proposedBooking.endAt)

                const actualStart = moment(booking.startAt)
                const actualEnd = moment(booking.endAt)
                const test = ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart))
                debugger
                return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart))
            })
        }

        return valid;
    },

}

module.exports = logic