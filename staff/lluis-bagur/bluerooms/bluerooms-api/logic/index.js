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

 // ------------ USER -------------------- //
    /**
    * Register User
    * 
    * @param {String} name The user name
    * @param {String} surname The user surname
    * @param {String} username The user username
    * @param {String} password The user password
    * @param {String} email The user email
    * @param {string} failname The user profile pick
    * 
    * @throws {TypeError} On non-string user data
    * @throws {AlreadyExistsError} if already exist the username
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */


const logic = {
    registerUser(filename, fileData, name, surname, username, password, email) { 
        validate([{ key: 'name', value: name, type: String }, { key: 'filename', value: filename, type: String }, { key: 'surname', value: surname, type: String }, { key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }, { key: 'email', value: email, type: String }])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            const image = await this.uploadCloudinary(filename, fileData)

            user = new User({ name, surname, username, password, email, image })

            await user.save()
        })()
    },

    /**
    * Authenticate User
    * 
    * @param {String} username The user username
    * @param {String} password The user password
    * 
    * @throws {TypeError} On non-string user id, non-string password 
    * @throws {AuthError} if invalid email or password
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    authenticateUser(username, password) { 
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    /** Retrieve User
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    retrieveUser(id) { 
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean().populate('rentals').populate('bookings')

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            const rentals = user.rentals // delete mongoose info
            rentals.forEach(rental => {
                rental.id = rental._id
                delete rental._id
                delete rental.__v

            });

            const bookings = user.bookings // delete mongoose info
            bookings.forEach(booking => {
                delete booking._id
                delete booking.__v

            });
            return user
        })()
    },

//........................... UPLOAD PHOTOS  .......................//


    uploadCloudinary(filename, data) {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, res) => {
                if (error) return reject(Error(`the file ${filename} could not be uploaded`));
                resolve(res.secure_url)

            }).end(data)
        })
    },

    //........................... RENTAL LOGIC .......................//

    /**
    * Create Rental
    * 
    * @param {String} title The rental title
    * @param {String} city The rental city
    * @param {String} street The rental street
    * @param {String} category The rental category
    * @param {String} bedrooms The rental bedrooms
    * @param {String} shared The rental shared
    * @param {String} description The rental description
    * @param {String} dailyRate The rental dailyRate
    * @param {string} failname The user profile pick Name
    * @param {string} failData The user profile pick Data
    * 
    * @throws {TypeError} On non-string rental data
    * @throws {NotFoundError} user with id not found`
    * @throws {AlreadyExistsError} if already exist the Rental ID
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

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

     /**
    * Update Rental
    * 
    * @param {String} title The rental title
    * @param {String} city The rental city
    * @param {String} street The rental street
    * @param {String} category The rental category
    * @param {String} bedrooms The rental bedrooms
    * @param {String} shared The rental shared
    * @param {String} description The rental description
    * @param {String} dailyRate The rental dailyRate
    * 
    * @throws {TypeError} On non-string rental data, and ID's
    * @throws {NotFoundError} user with id not found & Rental with id not found
    *     
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    updateRental(id, rentalId, title, city, street, category, image, bedrooms, shared, description, dailyRate) { // UPDATE USERS
        validate([{ key: 'id', value: id, type: String }, { key: 'rentalId', value: rentalId, type: String }, { key: 'title', value: title, type: String }, { key: 'city', value: city, type: String }, { key: 'street', value: street, type: String }, { key: 'category', value: category, type: String }, { key: 'image', value: image, type: String }, { key: 'bedrooms', value: bedrooms, type: Number }, { key: 'shared', value: shared, type: Boolean }, { key: 'description', value: description, type: String }, { key: 'dailyRate', value: dailyRate, type: Number }])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            

            const rental = await Rental.findById(rentalId)
            

            if (!rental) throw new NotFoundError(`Rental with id ${rentalId} not found`)


            title != null && (rental.title = title)
            city != null && (rental.city = city)
            street != null && (rental.street = street)
            category != null && (rental.category = category)
            image != null && (rental.image = image)
            bedrooms != null && (rental.bedrooms = bedrooms)
            shared != null && (rental.shared = shared)
            description != null && (rental.description = description)
            dailyRate != null && (rental.dailyRate = dailyRate)

            await rental.save()
        })()
    },

    /**
    * List all rentals
    * 
    * @throws {Error} On empty array of rentals 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    retriveRentals() {
        return (async () => {
            const _rentals = await Rental.find({}).lean()

            const rentals = _rentals.filter(_rental => _rental.view == true)

            rentals.forEach(rental => {
                rental.id = rental._id
                delete rental._id
                delete rental.__v
            });

            return rentals
        })()
    },

     /**
    * List Rentals by user ID
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id or user id 
    * @throws {Error} On empty or blank user id or user id 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    listRentalByUserId(id) {

        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, __v: 0 }).populate('rentals').populate('bookings').lean().exec()

            const rentals = user.rentals.filter(_rental => _rental.view == true)

            const _rentals = user.rentals
            _rentals.forEach(rental => {
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

     /**
    * List rentals by rental ID
    * 
    * @param {String} id The user id
    * @param {String} rentalId The rental ID 
    * 
    * @throws {TypeError} On non-string user id or rental id 
    * @throws {Error} On empty or blank user id or rental id 
    * @throws {NotFoundError} user with id not found
    * @throws {NotFoundError} rental with id not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

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

      /**
    * List rentals by query(city)
    * 
    * @param {String} query The city
    * 
    * @throws {TypeError} On non-string query
    * @throws {NotFoundError} Not rentals found in city
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    listRentalByQuery(query) {

        validate([{ key: 'query', value: query, type: String }])

        const city = query
        const _query = city ? { city: city.toLowerCase() } : {};

        return (async () => {
            const _rentals = await Rental.find(_query, { __v: 0 }).lean()

            const rental = _rentals.filter(_rental => _rental.view == true)


            rental.forEach(rental => {
                rental.id = rental._id
                delete rental._id

            });
            if (!rental.length>0) throw new NotFoundError(`Not rentals found in ${query}`)
            return rental
        })()
    },

    /**
    * Retrive one rental by ID
    * 
    * @param {String} rentalId The rental ID 
    * 
    * @throws {NotFoundError} Not rentals found with this ID
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    retriveRental(rentalId) {

        validate([{ key: 'rentalId', value: rentalId, type: String }])

        return (async () => {
            const rental = await Rental.findById(rentalId, { __v: 0 }).populate('bookings').populate('user').lean().exec()

            rental.user.id = rental.user._id
            delete rental.user._id
            delete rental.user.__v

            rental.id = rental._id
            delete rental._id
            
            return rental
        })()
    },

    /**
    * List rentals by rental ID
    * 
    * @param {String} id The user id
    * @param {String} rentalId The rental ID 
    * 
    * @throws {TypeError} On non-string user id or rental id 
    * @throws {Error} On empty or blank user id or rental id 
    * @throws {NotFoundError} user with id not found
    * @throws {NotFoundError} rental with id not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    removeRental(id, rentalId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'rentalId', value: rentalId, type: String }
        ])

        return (async () => {
            
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rental = await Rental.findById(rentalId)

            if (!rental) throw new NotFoundError(`rental with id ${rentalId} not found`)

            rental.view = false

            await rental.save()

        })()
    },

    enableRental(id, rentalId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'rentalId', value: rentalId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rental = await Rental.findById(rentalId)

            if (!rental) throw new NotFoundError(`rental with id ${rentalId} not found`)

            rental.view = true

            await rental.save()

        })()
    },


    //........................... BOOKING LOGIC .......................//

    
    /**
    * Create booking
    * 
    * @param {String} rentalId The rental rentalId
    * @param {String} endAt The rental endAt
    * @param {String} startAt The rental startAt
    * @param {String} totalPrice The rental totalPrice
    * @param {String} days The rental days
    * @param {String} guests The rental guests
    * 
    * @throws {TypeError} On non-string rental data
    * @throws {NotFoundError} user with id not found`
    * @throws {AlreadyExistsError} if already exist the Rental ID
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    addBooking(id, rentalId, endAt, startAt, totalPrice, days, guests) {
        validate([{ key: 'id', value: id, type: String },
        { key: 'rentalId', value: rentalId, type: String },
        { key: 'endAt', value: endAt, type: String },
        { key: 'startAt', value: startAt, type: String },
        { key: 'totalPrice', value: totalPrice, type: Number },
        { key: 'days', value: days, type: Number },
        { key: 'guests', value: guests, type: Number }])
        

        return (async () => {

            const user = await User.findById(id)
            const booking = new Booking({ startAt, endAt, totalPrice, guests, days});
            const foundRental = await Rental.findById(rentalId).populate('bookings')

            if (foundRental.user.id === user.id) {
                throw Error ('Cannot create booking on your Rental!' )
             }
            const valid = this.ValidBooking(booking, foundRental) 
            
                if (valid == true){
                    booking.user = user._id;
                    booking.rental = foundRental._id;
                    foundRental.bookings.push(booking._id);

                    await User.update({ _id: user.id }, { $push: { bookings: booking } });

                    await booking.save()

                    await foundRental.save()

                    return booking
                } else {

                    throw Error ('Choosen dates are already taken!' )
                }
                })()
    },

    /**
    * Check Dates
    * 
    * @param {Date} proposedBooking The rental days
    * @param {object} rental The rental data
    * 
    * @returns {Promise} Resolves true on correct data, rejects on wrong data
    */

    ValidBooking(proposedBooking, rental) {
        let valid = true;

        if (rental.bookings && rental.bookings.length > 0) {

            valid = rental.bookings.every(function (booking) {
                const proposedStart = moment(proposedBooking.startAt)
                const proposedEnd = moment(proposedBooking.endAt)

                const actualStart = moment(booking.startAt)
                const actualEnd = moment(booking.endAt)
                const test = ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart))
                return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart))
            })
        }

        return valid;
    },

}

module.exports = logic