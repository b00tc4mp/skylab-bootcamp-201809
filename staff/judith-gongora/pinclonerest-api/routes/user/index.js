const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../../utils/bearer-token-parser')
const jwtVerifier = require('../jwt-verifier')
const routeHandler = require('../route-handler')
const fileUpload = require('express-fileupload')

const jsonBodyParser = bodyParser.json()

const routerUser = express.Router()

const { env: { JWT_SECRET } } = process

routerUser.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { email, password, age } = req.body

        return logic.registerUser(email, password, age)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${email} successfully registered`
                })
            })
    }, res)
})

routerUser.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { email, password } = req.body
        return logic.authenticateUser(email, password)
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

routerUser.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
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

routerUser.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { name, surname, username, newPassword, email, age, password } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, name ? name : null, surname ? surname : null, username ? username : null, newPassword ? newPassword : null, email, age, password)
            .then(() =>
                res.json({
                    message: 'user updated'
                })
            )
    }, res)
})

routerUser.post('/users/:id/photo', [bearerTokenParser, jwtVerifier, fileUpload()], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id }, files: { photo } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.addUserPhoto(id, photo.name, photo.data)
            .then(() => res.json({
                message: 'photo user added'
            }))

    }, res)
})

module.exports = routerUser