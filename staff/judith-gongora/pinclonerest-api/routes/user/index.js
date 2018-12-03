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
        const { email, password, _age } = req.body

        return logic.registerUser(email, password, _age)
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

routerUser.get('/users/:id/user/:username', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id, username }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveOtherUser(id, username)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})


routerUser.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { name, surname, username } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, name ? name : null, surname ? surname : null, username ? username : null)
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

routerUser.patch('/users/:id/follow/:userId/user', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id, userId }} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.followUser(id, userId)
            .then(() => res.json({
                message: 'following user'
            }))

    }, res)
})

routerUser.delete('/users/:id/unfollow/:userId/user', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id, userId }} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.unfollowUser(id, userId)
            .then(() => res.json({
                message: 'following user remove'
            }))

    }, res)
})

routerUser.patch('/users/:id/follow/:boardId/board', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id, boardId }} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.followBoard(id, boardId)
            .then(() => res.json({
                message: 'following board'
            }))

    }, res)
})

routerUser.patch('/users/:id/pin/:pinId/:boardId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        
        const { sub, params: { id, pinId, boardId }} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.savePin(id, pinId, boardId)
            .then(() => res.json({
                message: 'pinned save'
            }))

    }, res)
})

routerUser.patch('/users/:id/pinned/:pinId/board/:boardId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
       
        const { sub, params: { id, pinId, boardId }, body : {description}} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.modifyPinned(id, pinId, boardId, description)
            .then(() => res.json({
                message: 'pinned modify'
            }))

    }, res)
})

routerUser.delete('/users/:id/pin/:pinId/remove', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }} = req
        
        if (id !== sub) throw Error('token sub does not match user id')
        
        return logic.removePinned(id, pinId)
            .then(() => res.json({
                message: 'pinned removed'
            }))

    }, res)
})

routerUser.get('/users/:id/following/:userId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id, userId }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.isFollowing(id, userId)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

module.exports = routerUser