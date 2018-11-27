const { Schema, model, SchemaTypes: { ObjectId } } = require('mongoose')

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
    multimedia: {
        type: String,
        required: true
    },
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
        type: String,
        default: 'https://res.cloudinary.com/skylabcoders/image/upload/v1542973821/Solid_gray.png',
        required: true
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

const Pinned = new Schema({
    pin: {
        type: ObjectId,
        ref: 'Pin'
    },
    board: {
        type: ObjectId,
        ref: 'Board'
    },
    description: String
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
        unique: true,
        required: true
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
        type: String,
        default: 'https://res.cloudinary.com/skylabcoders/image/upload/v1542887906/avatar.png'
    },
    boards: [{
        type: ObjectId,
        ref: 'Boards'
    }],
    age: {
        type: Number,
        required: true
    },
    pins: [Pinned],
    tries: [{
        type: ObjectId,
        ref: 'Pin'
    }]
})


module.exports = {
    Pin,
    User,
    Comment,
    Photo,
    Board,
    Pinned
}





