const mongoose = require('mongoose')

const { Pin, User, Comment, Photo, Board, Pinned } = require('./schemas')

module.exports = {
    Pin: mongoose.model('Pin', Pin),
    Pinned: mongoose.model('Pinnned', Pinned),
    User: mongoose.model('User', User),
    Comment: mongoose.model('Comment', Comment),
    Photo: mongoose.model('Photos', Photo),
    Board: mongoose.model('Board', Board)
}