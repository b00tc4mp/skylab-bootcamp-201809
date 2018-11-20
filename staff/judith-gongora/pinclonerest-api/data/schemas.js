const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Comment = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    replyTo: {
        type: ObjectId,
        ref: 'Comment'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Photo = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    comments: [Comment],
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Pin = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    multimedia: {
        type: String,
        required: true
    },
    board: {
        type: ObjectId,
        ref: 'Board',
        required: true
    },
    url: {
        type: String
    },
    title: {
        type: String
    },
    comments: [Comment],
    pins: [{
        type: ObjectId,
        ref: 'User'
    }],
    photos: [Photo],
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Board = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    cover: {
        type: String
    },
    secret: {
        type: Boolean,
        required: true
    },
    archive: {
        type: Boolean
    },
    collaborators: [{
        type: ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    pins: [{
        type: ObjectId,
        ref: 'Pin',
    }]
})

const User = new Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    img: {
        type: String
    },
    boards :[{
        type: ObjectId,
        ref: 'Boards'
    }],
    age:{
        type: Number,
        required: true
    },
    pins:[{
        type: ObjectId,
        ref: 'Pin'
    }],
    tries:[{
        type: ObjectId,
        ref: 'Pin'
    }]
})

module.exports = {
    Pin,
    User,
    Comment,
    Photo,
    Board
}
