const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../../logic')
const bearerTokenParser = require('../../utils/bearer-token-parser')
const jwtVerifier = require('../jwt-verifier')
const routeHandler = require('../route-handler')
const fileUpload = require('express-fileupload')

const jsonBodyParser = bodyParser.json()

const routerComment = express.Router()

routerComment.post('/users/:id/pins/:pinId/comment', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addComment(id, pinId, content )
            .then(() => res.json({
                message: 'comment added'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/:commentId/reply', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, commentId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentReply(id, pinId, commentId, content )
            .then(() => res.json({
                message: 'reply added'
            }))
    }, res)
})

routerComment.post('/users/:id/pins/:pinId/photo', [bearerTokenParser, jwtVerifier, jsonBodyParser, fileUpload()], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }, body: { content }, files: { photo } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPhoto(id, pinId, photo.name, photo.data, content )
            .then(() => res.json({
                message: 'comment photo added'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/photo/:photoId/comment', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentPhoto(id, pinId, photoId, content )
            .then(() => res.json({
                message: 'comment added to photo'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/photo/:photoId/comment/:commentId/reply', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId, commentId }, body: { content } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addCommentPhotoReply(id, pinId, photoId, commentId, content )
            .then(() => res.json({
                message: 'comment added to comment photo'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/photo/:photoId/comment/:commentId/like', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId, commentId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addLikeCommentPhoto(id, pinId, photoId, commentId)
            .then(() => res.json({
                message: 'add like comment photo'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/photo/:photoId/like', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, photoId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addLikePhoto(id, pinId, photoId)
            .then(() => res.json({
                message: 'add like to photo'
            }))
    }, res)
})

routerComment.put('/users/:id/pins/:pinId/comment/:commentId/like', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, commentId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.likeComment(id, pinId, commentId)
            .then(() => res.json({
                message: 'add like to comment'
            }))
    }, res)
})

routerComment.get('/users/:id/pins/:pinId/comments', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveComments(id, pinId)
            .then(comments => res.json({
                data: comments
            }))
    }, res)
})

routerComment.get('/users/:id/pins/:pinId/photos', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrievePhotos(id, pinId)
            .then(photos => res.json({
                data: photos
            }))
    }, res)
})

routerComment.get('/users/:id/pins/:pinId/comment/:commentId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, commentId }} = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUserComment(id, pinId, commentId)
            .then(user => res.json({
                data: user
            }))
    }, res)
})

module.exports = routerComment