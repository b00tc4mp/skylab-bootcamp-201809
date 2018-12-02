const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../../logic')
const bearerTokenParser = require('../../utils/bearer-token-parser')
const jwtVerifier = require('../jwt-verifier')
const routeHandler = require('../route-handler')
const fileUpload = require('express-fileupload')

const jsonBodyParser = bodyParser.json()

const routerPin = express.Router()


// routerPin.post('/users/:id/url', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
//     routeHandler(() => {
//         const { sub, params: { id }, body: { url }} = req
       
//         if (id !== sub) throw Error('token sub does not match user id')

//         return logic.screenshotUrl(url)
//             .then(img => {
//                 debugger
                
//                 return res.json({
//                 data: img
//             })})

//     }, res)
// })
routerPin.get('/users/:id/allPins', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listAllPins(id)
            .then(pins => res.json({
                data: pins
            }))
    }, res)
})

// routerPin.get('/users/:id/board/:boardId', [bearerTokenParser, jwtVerifier], (req, res) => {
//     routeHandler(() => {
//         const { sub, params: { id, boardId } } = req

//         if (id !== sub) throw Error('token sub does not match user id')

//         return logic.listBoardPins(id, boardId)
//             .then(pins => res.json({
//                 data: pins
//             }))
//     }, res)
// })


routerPin.get('/users/:id/pinUser/:userPinId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id, userPinId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrievePinUser(id, userPinId)
            .then(user => res.json({
                data: user
            }))
    }, res)
})

routerPin.post('/users/:id/pins', [bearerTokenParser, jwtVerifier, jsonBodyParser, fileUpload()], (req, res) => {
    routeHandler(() => {

        const { sub, params: { id }, body: { board, url, title, description }, files: { photo } } = req
       
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPin(id, photo.name, photo.data, board, url, title, description)
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

routerPin.get('/users/:id/user/:username/pins', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, username } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listOtherPins(id, username)
            .then(pins => res.json({
                data: pins
            }))
    }, res)
})

routerPin.get('/users/:id/pin/:pinId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId } } = req
 
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrievePin(id, pinId)
            .then(pin => res.json({
                data: pin
            }))
    }, res)
})

routerPin.get('/users/:id/board/:boardId/pins', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, boardId } } = req
 
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveBoardPins(id, boardId)
            .then(pins => res.json({
                data: pins
            }))
    }, res)
})

routerPin.get('/users/:id/user/:userId/board/:boardId/pins', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, userId, boardId } } = req
 
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveOtherBoardPins(id, userId, boardId)
            .then(pins => res.json({
                data: pins
            }))
    }, res)
})

routerPin.patch('/users/:id/pin/:pinId/board/:boardId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId, boardId }, body: { description } } = req
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyPin(id, pinId, boardId, description )
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

routerPin.get('/users/:id/pins/:pinId/board', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.pinBoard(id, pinId)
            .then(board => res.json({
                data: board
            }))
    }, res)
})

routerPin.get('/users/:id/pins/:pinId/pinned', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, pinId } } = req
        
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.isPinned(id, pinId)
            .then(board => res.json({
                data: board
            }))
    }, res)
})


module.exports = routerPin