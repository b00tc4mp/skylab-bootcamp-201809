const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../../logic')
const bearerTokenParser = require('../../utils/bearer-token-parser')
const jwtVerifier = require('../jwt-verifier')
const routeHandler = require('../route-handler')
const fileUpload = require('express-fileupload')

const jsonBodyParser = bodyParser.json()

const routerPin = express.Router()

routerPin.post('/users/:id/pins', [bearerTokenParser, jwtVerifier, jsonBodyParser, fileUpload()], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { board, url, title }, files: { photo } } = req
       
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPin(id, photo.name, photo.data, board, url, title)
            .then(() => res.json({
                message: 'pin added'
            }))

    }, res)
})

routerPin.get('/users/:id/pins', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPins(id)
            .then(pins => res.json({
                data: pins
            }))
    }, res)
})

routerPin.patch('/users/:id/pins/:pinId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }, body: { board, description } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyPin(id, pinId, board, description )
            .then(() => res.json({
                message: 'pin modified'
            }))
    }, res)
})


routerPin.delete('/users/:id/pins/:pinId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removePin(id, pinId)
            .then(() => res.json({
                message: 'pin removed'
            }))
    }, res)

})

routerPin.post('/users/:id/pins/:pinId/comment', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addComment(id, pinId, content )
            .then(() => res.json({
                message: 'comment added'
            }))
    }, res)
})

routerPin.put('/users/:id/pins/:pinId/:commentId/reply', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, commentId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentReply(id, pinId, commentId, content )
            .then(() => res.json({
                message: 'reply added'
            }))
    }, res)
})

routerPin.post('/users/:id/pins/:pinId/photo', [bearerTokenParser, jwtVerifier, jsonBodyParser, fileUpload()], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }, body: { content }, files: { photo } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPhoto(id, pinId, photo.name, photo.data, content )
            .then(() => res.json({
                message: 'comment photo added'
            }))
    }, res)
})

routerPin.put('/users/:id/pins/:pinId/photo/:photoId/comment', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentPhoto(id, pinId, photoId, content )
            .then(() => res.json({
                message: 'comment added to photo'
            }))
    }, res)
})

routerPin.put('/users/:id/pins/:pinId/photo/:photoId/comment/:commentId/reply', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId, commentId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentPhotoReply(id, pinId, photoId, commentId, content )
            .then(() => res.json({
                message: 'comment added to comment photo'
            }))
    }, res)
})

module.exports = routerPin