const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../../logic')
const bearerTokenParser = require('../../utils/bearer-token-parser')
const jwtVerifier = require('../jwt-verifier')
const routeHandler = require('../route-handler')


const jsonBodyParser = bodyParser.json()

const routerBoard = express.Router()


// Adds board
routerBoard.post('/users/:id/boards', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { title, secret } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addBoard(id, title, secret)
            .then(() => res.json({
                message: 'board added'
            }))

    }, res)
})

//List user boards
routerBoard.get('/users/:id/boards', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listUserBoards(id)
            .then(boards => res.json({
                data: boards
            }))
    }, res)
})

//Modify user board
routerBoard.patch('/users/:id/boards/:boardId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, boardId }, body: { title, description, category, cover, secret, collaborators, archive } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyBoard(id, boardId, title, description, category, cover, secret, collaborators, archive )
            .then(() => res.json({
                message: 'board modified'
            }))
    }, res)
})

//merge user board. Move the pins to other board and remove the current board
routerBoard.patch('/users/:id/boards/:boardIdFrom/merge/:boardIdTo', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, boardIdFrom, boardIdTo } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.mergeBoard(id, boardIdFrom, boardIdTo )
            .then(() => res.json({
                message: 'boards merge'
            }))
    }, res)
})

//Delete user board
routerBoard.delete('/users/:id/boards/:boardId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, boardId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removeBoard(id, boardId)
            .then(() => res.json({
                message: 'board removed'
            }))
    }, res)

})

module.exports = routerBoard