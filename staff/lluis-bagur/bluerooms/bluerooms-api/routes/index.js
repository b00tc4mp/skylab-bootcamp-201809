const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')
const fileUpload = require('express-fileupload')

const jsonBodyParser = bodyParser.json()

const router = express.Router()

const { env: { JWT_SECRET } } = process


// ....................  USER ROUTES .....................//

router.post('/users', [jsonBodyParser, fileUpload()], (req, res) => {
    
    routeHandler(() => {
        const { body: { name, surname, username, password, email }, files: { photo } } = req


        return logic.registerUser(photo.name, photo.data, name, surname, username, password, email)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${username} successfully registered`
                })
            })
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})


// ....................  RENTAL ROUTES .....................//

//ADD RENTALS

router.post('/users/:id/rentals', [bearerTokenParser, jwtVerifier, jsonBodyParser, fileUpload()], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { title, city, street, category, bedrooms, shared, description, dailyRate }, files: { photo } } = req
        const bedroomsNum = Number(bedrooms)
        const dailyRateNum = Number(dailyRate)
        const sharedBool = Boolean(shared)
        if (id !== sub) throw Error('token sub does not match user id')
        return logic.addRental(id, photo.name, photo.data, title, city, street, category, bedroomsNum, sharedBool, description, dailyRateNum)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${title} successfully created`
                })
            })
    }, res)
})

// LIST RENTALS BY ID

router.get('/rentals', (req, res) => {
    routeHandler(() => {
        return logic.retriveRentals()
            .then(rentals => {
                return res.json({
                    data: rentals
                })
            }
            )
    }, res)
})

router.get('/rentals/:idRental', [jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { idRental } } = req

        return logic.retriveRental(idRental)
            .then(rental => {
                return res.json({
                    data: rental
                })
            }
            )
    }, res)
})


router.get('/users/:id/rentals', [jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listRentalByUserId(id)
            .then(rentals => {
                return res.json({
                    data: rentals
                })
            }
            )
    }, res)
})

router.get('/users/:id/rentals/:rentalId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id, rentalId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listRentalByRentalId(id, rentalId)
            .then(rentals => {
                
                return res.json({
                    data: rentals
                })
            })
    }, res)
})


router.post('/rentals/:query', [jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { query } } = req

        return logic.listRentalByQuery(query)
            .then(rentals => {
                return res.json({
                    data: rentals
                })
            })
    }, res)
})

//UPDATE RENTAL

router.patch('/users/:id/rentals/:rentalId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, rentalId }, body: { title, city, street, category, image, bedrooms, shared, description, dailyRate } } = req
        if (id !== sub) throw Error('token sub does not match user id')
        return logic.updateRental(id, rentalId, title ? title : null, city ? city : null, street ? street : null, category ? category : null, image ? image : null, bedrooms ? bedrooms : null, shared ? shared : null, description ? description : null, dailyRate ? dailyRate : null)
            .then(() =>
                res.json({
                    message: 'Rental updated'
                })
            )
    }, res)
})


// DELETE RENTAL

router.delete('/users/:id/rentals/:rentalId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, rentalId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removeRental(id, rentalId)
            .then(() => res.json({
                message: 'Rental disabled'
            }))
    }, res)
})

// ENABLE RENTAL

router.post('/users/:id/rentals/:rentalId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, rentalId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.enableRental(id, rentalId)
            .then(() => res.json({
                message: 'Rental enabled'
            }))
    }, res)
})
//

// ....................  BOOKING ROUTES .....................//


//ADD BOOKING

router.post('/users/:id/rentals/:rentalId/bookings', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id, rentalId }, sub, body: { endAt, startAt, totalPrice, days, guests } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addBooking(id, rentalId, endAt, startAt, totalPrice, days, guests)
            .then((booking) => {
                res.status(201)

                res.json({
                    data: booking,
                    message: `your booking has been succesfully`
                })
            })
    }, res)
})


module.exports = router