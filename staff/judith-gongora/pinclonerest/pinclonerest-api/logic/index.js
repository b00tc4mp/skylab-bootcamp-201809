const { User, Photo, Pin, Comment, Board, Pinned } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const ObjectId = require('mongoose').Types.ObjectId
const cloudinary = require("../utils/cloudinary")
const Screenshot = require('url-to-screenshot')
const fs = require('fs')
const streamBuffers = require('stream-buffers')
const mongoose = require('mongoose');

const logic = {

    // ------------ USER -------------------- //
    /**
    * Register User
    * 
    * @param {String} email The user email
    * @param {String} password The user password
    * @param {Number} age The user age
    * 
    * @throws {TypeError} On non-string user id, non-string password or non-number age
    * @throws {AlreadyExistsError} if already exist the email
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    registerUser(email, password, age) {
        validate([{ key: 'email', value: email, type: String }, { key: 'password', value: password, type: String }, { key: 'age', value: age, type: Number }])

        return (async () => {
            let user = await User.findOne({ email })

            if (user) throw new AlreadyExistsError(`email ${email} already registered`)

            const username = await this.generateUsername(email)

            user = new User({ email, password, age, username })

            await user.save()
        })()
    },

    generateUsername(email) {
        return (async () => {
            let username = email.split('@')[0]
            const count = await User.count({ username: { $regex: new RegExp(username, 'ig') } })
            return `${username}-${count + 1}`
        })()
    },

    /**
    * Authenticate User
    * 
    * @param {String} email The user email
    * @param {String} password The user password
    * 
    * @throws {TypeError} On non-string user id, non-string password 
    * @throws {AuthError} if invalid email or password
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    authenticateUser(email, password) {
        validate([{ key: 'email', value: email, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ email })

            if (!user || user.password !== password) throw new AuthError('invalid email or password')

            return user.id
        })()
    },

    /**
    * Retrieve User
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveUser(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, pins: 0, __v: 0, tries: 0, boards: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            user.followers != null && (user.followers = user.followers.length)
            user.following != null && (user.following = user.following.length)

            return user
        })()
    },

    /**
    * Retrieve followings of user
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveFollowings(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { following: true }).populate('following').lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const following = user.following

            following.forEach(follow => {
                follow.id = follow._id.toString()
                delete follow._id
                delete follow.__v
                delete follow.pins
                delete follow.boards
                delete follow.password
                delete follow.age
                delete follow.email
                delete follow.tries
                delete follow.following
                delete follow.followers
            })



            return following
        })()
    },

    /**
    * Retrieve followings of user
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveFollowers(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { followers: true }).populate('followers').lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const followers = user.followers

            followers.forEach(follower => {
                follower.id = follower._id.toString()
                delete follower._id
                delete follower.__v
                delete follower.pins
                delete follower.boards
                delete follower.password
                delete follower.age
                delete follower.email
                delete follower.tries
                delete follower.following
                delete follower.followers
            })



            return followers
        })()
    },

    /**
    * Retrieve Other User
    * 
    * @param {String} id The user id
    * @param {String} username The user username of other user
    * 
    * @throws {TypeError} On non-string user id, or username of other user
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveOtherUser(id, username) {
        validate([{ key: 'id', value: id, type: String },
        { key: 'username', value: username, type: String }])

        return (async () => {
            const _user = await User.findById(id)

            if (!_user) throw new NotFoundError(`user with id ${id} not found`)

            const user = await User.findOne({ username: username }, { password: 0, pins: 0, __v: 0, tries: 0, boards: 0 }).lean()

            if (!user) throw new NotFoundError(`user with username ${username} not found`)

            user.id = user._id.toString()
            delete user._id

            user.followers != null && (user.followers = user.followers.length)
            user.following != null && (user.following = user.following.length)

            return user
        })()
    },

    /**
    * Update User
    * 
    * @param {String} id The user id
    * @param {String} username The user username 
    * 
    * @throws {TypeError} On non-string user id, non-string name, non-string surname, non-string username 
    * @throws {NotFoundError} if user not found
    * @throws {AlreadyExistsError} if username already exists
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    updateUser(id, name, surname, username) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: surname, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)

                await user.save()
            }
        })()
    },

    /**
    * Update Photo of User
    * 
    * @param {String} id The user id
    * @param {String} filename The name of file
    * @param {Buffer} data The buffer of file
    * 
    * @throws {TypeError} On non-string user id, non-string filename
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    addUserPhoto(id, filename, data) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'filename', value: filename, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)
            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            user.img = await this.uploadCloudinary(filename, data)
            await user.save()

        })()
    },

    /**
    * Add follow
    * 
    * @param {String} id The user id
    * @param {String} userId The user id to follow
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * @throws {AlreadyExistsError} if user already exists in the followings
    * @throws {Error} if user that you want follow are you
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    followUser(id, userId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const user2 = await User.findById(userId)

            if (!user2) throw new NotFoundError(`user with id ${userId} not found`)

            user.following.forEach(user => {
                if (user.toString() === userId) throw new AlreadyExistsError(`user with id ${userId} already exists in followings`)
                if (user.toString() === id) throw Error("You can't follow yourself")
            })

            user.following.push(user2.id)
            user2.followers.push(user.id)

            await user.save()
            await user2.save()

        })()
    },

    /**
    * remove follow
    * 
    * @param {String} id The user id
    * @param {String} userId The user id to follow
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    unfollowUser(id, userId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const user2 = await User.findById(userId)

            if (!user2) throw new NotFoundError(`user with id ${userId} not found`)

            user.following = user.following.filter(user => user.toString() !== userId)
            user2.followers = user2.followers.filter(user => user.toString() !== id)

            await user.save()
            await user2.save()

        })()
    },

    /**
    * User is in followings
    * 
    * @param {String} id The user id
    * @param {String} userId The user id to follow
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    isFollowing(id, userId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const user2 = await User.findById(id)

            if (!user2) throw new NotFoundError(`user with id ${id} not found`)

            let follow = false

            user.following.forEach(_follow => {

                if (_follow.toString() === userId) {

                    follow = true

                }

            })

            return follow

        })()
    },

    /**
    * Add board to follow
    * 
    * @param {String} id The user id
    * @param {String} boardId The board id to follow
    * 
    * @throws {TypeError} On non-string user id or board id
    * @throws {NotFoundError} if user or board not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    followBoard(id, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const board = await Board.findById(boardId)

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            user.boards.push(board.id)

            await user.save()

        })()
    },

    /**
    * Add Pinned
    * 
    * @param {String} id The user id
    * @param {String} userId The user id to follow
    * @param {String} boardId The board id to follow
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user, pin or board not found
    * @throws {AlreadyExistsError} if pin already exists in your pinneds
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    savePin(id, pinId, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'boardId', value: boardId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const board = await Board.findById(boardId)

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            if (user.pins) {
                user.pins.forEach(pinned => {
                    if (pinned.pin.toString() === pinId) throw new AlreadyExistsError(`pin ${pinId} already pinned`)

                })
            }
            const pinned = new Pinned({ pin: pin.id, board: board.id })

            user.pins.push(pinned)

            pin.pins.push(user.id)

            board.pins.push(pin.id)

            await pin.save()

            await board.save()

            await user.save()

        })()
    },

    /**
    * retrieve description
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id to pinned
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user or pin not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveDescriptionPinned(id, pinId){
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const pinned = user.pins.filter(pinned => pinned.pin.toString() === pinId)

            if(pinned[0].description) return pinned[0].description

            else return ''

        })()
    },

    /**
    * Remove Pinned
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id to pinned
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user or pin not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    removePinned(id, pinId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const pinned = user.pins.filter(pinned => pinned.pin.toString() === pinId)

            const board = await Board.findById(pinned[0].board.toString())

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            user.pins = user.pins.filter(pinned => pinned.pin.toString() !== pinId)

            pin.pins = pin.pins.filter(pin => pin.toString() !== id)

            board.pins = board.pins.filter(pin => pin.toString() !== pinId)

            await pin.save()

            await board.save()

            await user.save()

        })()
    },

    /**
    * Remove Pinned
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id to pinned
    * @param {String} boardId The board id 
    * @param {String} description The description to pinned
    * 
    * @throws {TypeError} On non-string user id
    * @throws {NotFoundError} if user, boards or pin not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    modifyPinned(id, pinId, boardId, description) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'boardId', value: boardId, type: String },
            { key: 'description', value: description, type: String, optional: true }
        ])

        return (async () => {
            const user = await User.findById(id).populate('pins')

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const board = await Board.findById(boardId)

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            const pinned = user.pins.filter(pinned => pinned.pin.toString() === pinId)

            if (pinned[0].board.toString() !== boardId) {

                const _board = await Board.findById(pinned[0].board)

                if (!_board) throw new NotFoundError(`_board with id ${_boardId} not found`)

                _board.pins = _board.pins.filter(pin => pin.toString() !== pinId)

                await _board.save()

                board.pins.push(pin.id)

                await board.save()

            }

            pinned[0].board = board.id
            description != null && (pinned[0].description = description)

            await user.save()

        })()
    },

    // screenshotUrl(url) {
    //     return new Screenshot(url)
    //         .width(800)
    //         .height(600)
    //         .capture()
    //         .then(img => {
    //             debugger
    //             //return this.uploadCloudinary('screenshot.png', img)

    //             return new Promise((resolve, reject) => {
    //                 const rs =  new streamBuffers.ReadableStreamBuffer({
    //                     frequency: 10,
    //                     chunkSize: 2048
    //                 })

    //                 rs.put(img)

    //                 const ws = cloudinary.v2.uploader.upload_stream((error, res) => {
    //                     if (error) return reject(Error(`the file could not be uploaded`));

    //                     debugger
    //                     resolve(res.secure_url)
    //                 })

    //                 rs.pipe(ws)
    //             })
    //         })
    //         .then(url => url)
    // },

    uploadCloudinary(filename, data) {

        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, res) => {
                if (error) return reject(Error(`the file ${filename} could not be uploaded`));

                resolve(res.secure_url)

            }).end(data)
        })
    },

    // -------------- PINS ---------------- //

    /**
     * Adds a pin
     * 
     * @param {String} id The user id
     * @param {String} filename The photo name
     * @param {Buffer} fileData The photo buffer
     * @param {String} board The board id
     * @param {String} url The external url
     * @param {String} title The pin title
     * 
     * @throws {TypeError} On non-string user id, non-string photo name, non-string board id, non-string url or non-string title
     * @throws {Error} On empty or blank user id, photo name, board id
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong data
     */
    addPin(id, filename, fileData, boardId, url, title, description) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'filename', value: filename, type: String },
            { key: 'boardId', value: boardId, type: String },
            { key: 'url', value: url, type: String, optional: true },
            { key: 'title', value: title, type: String, optional: true },
            { key: 'description', value: description, type: String, optional: true },
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const multimedia = await this.uploadCloudinary(filename, fileData)

            const board = await Board.findById(boardId)

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            const pin = new Pin({ multimedia, user: user.id, board: board.id })

            pin.pins.push(user.id)

            title != null && (pin.title = title)
            url != null && (pin.url = url)
            description != null && (pin.description = description)

            const pinned = new Pinned({ pin: pin.id, board: board.id })

            board.pins.push(pin.id)
            user.pins.push(pinned)

            await user.save()
            await board.save()
            await pin.save()

        })()
    },

    /**
    * List pin
    * 
    * @param {String} id The user id
    * @param {String} pinid The pin id
    * 
    * @throws {TypeError} On non-string user id or pin id 
    * @throws {Error} On empty or blank user id or pin id 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    retrievePin(id, pinId) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId).lean()

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            pin.id = pin._id.toString()
            pin.user = pin.user.toString()
            pin.board = pin.board.toString()

            delete pin._id
            delete pin.__v

            if (pin.comments.length !== 0) {

                pin.comments.forEach(comment => {
                    comment.id = comment._id
                    delete comment._id
                    delete comment.__v
                })
            }

            if (pin.pins.length !== 0) {
                pin.pins.forEach(user => {

                    user = user.toString()
                })
            }

            return pin
        })()
    },

    /**
    * List user pins
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {Error} On empty or blank user id 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    listPins(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])

        return (async () => {
            // const pins = await User.findById(id, {pins: true}).lean().populate([
            //     { path: 'pins.pin'}
            //   ]).exec()

            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            let [{ pins }] = await User.aggregate([
                {
                    $match: {
                        _id: ObjectId(id)
                    }
                },

                {
                    $lookup: {
                        from: 'pins',
                        localField: 'pins.pin',
                        foreignField: '_id',
                        as: 'pins'
                    }
                },

                {
                    $project: {
                        _id: 0,

                        pins: {
                            $map: {
                                input: '$pins',
                                as: 'pin',
                                in: {
                                    id: '$$pin._id',
                                    multimedia: '$$pin.multimedia',
                                    user: '$$pin.user',
                                    url: '$$pin.url',
                                    title: '$$pin.title',
                                    description: '$$pin.description',
                                    board: '$$pin.board',
                                    pins: '$$pin.pins'

                                }
                            }
                        }
                    }
                }
            ])

            return pins

        })()
    },

    /**
    * List pins of other user
    * 
    * @param {String} id The user id
    * @param {String} username The username of other user
    * 
    * @throws {TypeError} On non-string user id or username
    * @throws {Error} On empty or blank user id 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */

    listOtherPins(id, username) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'username', value: username, type: String }
        ])

        return (async () => {

            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const user = await User.findOne({ username: username }).populate({ path: 'boards', populate: { path: 'pins' } }).lean()

            if (!user) throw new NotFoundError(`user with username ${username} not found`)

            boards = user.boards.filter(board => !board.secret)

            let pins = []

            boards.forEach(board => {
                board.pins.forEach(pin => pins.push(pin))
            })

            pins.forEach(pin => {
                pin.id = pin._id.toString()
                delete pin._id
                delete pin.__v
                delete pin.pins
                delete pin.comments
                delete pin.photos
            })

            return pins

        })()
    },

    /**
    * List user pins in a determinate board
    * 
    * @param {String} id The user id
    * @param {String} boardId The board id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {Error} On empty or blank user id 
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveBoardPins(id, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'boardId', value: boardId, type: String }
        ])

        return (async () => {

            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const boardPins = await Board.findById(boardId, { pins: true }).lean().populate('pins')

            if (!boardPins) throw new NotFoundError(`board with id ${boardId} is empty`)

            pins = boardPins.pins

            pins.forEach(pin => {
                pin.id = pin._id
                delete pin._id
                delete pin.__v
            })

            return pins

        })()
    },

    /**
    * List other user pins in board
    * 
    * @param {String} id The user id
    * @param {String} userId The other user id
    * @param {String} boardId The board of other user
    * 
    * @throws {TypeError} On non-string user id, id or board id
    * @throws {Error} On empty or blank user id, id or board id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    retrieveOtherBoardPins(id, userId, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'boardId', value: boardId, type: String }
        ])

        return (async () => {

            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const _exists = !!await User.findById(userId).countDocuments()

            if (!_exists) throw new NotFoundError(`user with id ${userId} not found`)

            const boardPins = await Board.findById(boardId, { pins: true }).lean().populate('pins')

            if (!boardPins) throw new NotFoundError(`board with id ${boardId} is empty`)

            pins = boardPins.pins

            pins.forEach(pin => {
                pin.id = pin._id
                delete pin._id
                delete pin.__v
            })

            return pins

        })()
    },

    /**
    * Return board if is pinned
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * 
    * @throws {TypeError} On non-string user id or pin id 
    * @throws {Error} On empty or blank user id or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    isPinned(id, pinId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id).populate('pins')

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            let board = null

            user.pins.forEach(pinned => {
                if (pinned.pin.toString() === pinId) board = pinned.board.toString()
            })
            if (board !== null) {

                board = await Board.findById(board).lean()
                board.id = board._id.toString()

                delete board._id
                delete board.__v
            }


            return board
        })()
    },

    /**
    * List all Pins of app
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id
    * @throws {Error} On empty or blank user id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data 
    */
    listAllPins(id) {
        return (async () => {

            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pins = await Pin.find().lean().populate('boards', 'pins') //Pin.distinct({user:id})

            _pins = pins.map(pin => {

                if (!pin.board.secret) {

                    pin.id = pin._id.toString()

                    delete pin._id
                    delete pin.board
                    delete pin.__v

                    pin.comments.forEach(comment => {
                        comment.id = comment._id.toString()
                        delete comment._id
                    })

                    pin.photos.forEach(photo => {
                        photo.id = photo._id.toString()
                        delete photo._id
                        photo.comments.forEach(comment => {
                            comment.id = comment._id.toString()
                            delete comment._id
                        })
                    })



                    return pin

                }

            })


            return _pins
        })()
    },

    /**
     * Return user pin
     * 
     * @param {string} id The user id
     * @param {string} userPinId The pin id
     * 
     * @throws {TypeError} On non-string user id, or non-string user pin id
     * @throws {Error} On empty or blank user id or user pin id
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id, or user pin id
     */
    retrievePinUser(id, userPinId) {
        validate([{ key: 'id', value: id, type: String },
        { key: 'userPinId', value: userPinId, type: String }])
        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const _userPinId = await User.findById(userPinId, { '_id': 0, password: 0, pins: 0, __v: 0, tries: 0, boards: 0, name: 0, surname: 0, email: 0, following: 0, age: 0 }).lean()

            if (!_userPinId) throw new NotFoundError(`user with id ${userPinId} not found`)

            _userPinId.id = userPinId

            return _userPinId
        })()
    },

    /**
     * Removes a pin
     * 
     * @param {string} id The user id
     * @param {string} pinId The pin id
     * 
     * @throws {TypeError} On non-string user id, or non-string pin id
     * @throws {Error} On empty or blank user id or pin id
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id, or pin id
     */
    removePin(id, pinId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findOne({ user: user._id, _id: pinId })

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            await pin.remove()
        })()
    },

    /**
    * Modify a pin
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} board The board id
    * @param {String} description The pin description
    * 
    * @throws {TypeError} On non-string user id, non-string photo name, non-string board id or non-string description
    * @throws {Error} On empty or blank user id, pin id or board id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong data
    */
    modifyPin(id, pinId, board, description) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'board', value: board, type: String },
            { key: 'description', value: description, type: String, optional: true }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findOne({ user: user._id, _id: pinId })

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            description != null && (pin.description = description)

            pin.board = new ObjectId(board)

            await pin.save()
        })()
    },
    // -------------- BOARDS ------------------ //

    /**
    * 
    * @param {String} id The user id
    * @param {String} title The board title
    * @param {Boolean} secret if board secret
    * 
    * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
    * @throws {Error} On empty or blank user id, board title or board secret
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, board title or board secret
    */
    addBoard(id, title, secret) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'title', value: title, type: String },
            { key: 'secret', value: secret, type: Boolean }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const exists = await Board.findOne({title: title}).countDocuments()

            if(exists) throw new AlreadyExistsError(`board with name ${title} already registered`)

            const board = new Board({ user: user.id, title, secret })

            await board.save()

            user.boards.push(board.id)

            await user.save()

            const _board = await Board.findById(board.id).lean()

            _board.id = _board._id.toString()

            delete _board._id
            delete _board.__v

            return _board

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * 
    * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
    * @throws {Error} On empty or blank user id, board title or board secret
    * 
    * @returns {Board} Return user boards
    */
    listUserBoards(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])

        return (async () => {
            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const boards = await Board.find({ user: user._id }).lean()

            boards.forEach(board => {
                board.id = board._id.toString()

                delete board._id
                delete board.__v

                board.user = board.user.toString()

                user.followers != null && (user.followers = user.followers.length)
                user.pins != null && (user.pins = user.pins.length)

                if (board.collaborators)
                    board.collaborators = board.collaborators.toString()

                return board
            })

            return boards
        })()
    },

    /**
   * 
   * @param {String} id The user id
   * 
   * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
   * @throws {Error} On empty or blank user id, board title or board secret
   * 
   * @returns {Board} Return user boards
   */
    listOtherBoards(id, username) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'username', value: username, type: String }
        ])

        return (async () => {

            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const user = await User.findOne({ username: username }).lean()

            if (!user) throw new NotFoundError(`user with username ${username} not found`)

            const boards = await Board.find({ user: user._id, secret: false }).lean()

            boards.forEach(board => {
                board.id = board._id.toString()

                delete board._id
                delete board.__v

                board.user = board.user.toString()

                user.followers != null && (user.followers = user.followers.length)
                user.pins != null && (user.pins = user.pins.length)

                if (board.collaborators)
                    board.collaborators = board.collaborators.toString()

                return board
            })

            return boards
        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} boardtitle The title of user board
    * 
    * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
    * @throws {Error} On empty or blank user id, board title or board secret
    * 
    * @returns {Board} Return user boards
    */
    retrieveBoard(id, boardTitle) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'boardTitle', value: boardTitle, type: String }
        ])

        return (async () => {
            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const board = await Board.findOne({ user: user._id, title: boardTitle }).lean()
            
            board.id = board._id.toString()

            delete board._id
            delete board.__v

            board.user = board.user.toString()

            user.followers != null && (user.followers = user.followers.length)
            user.pins != null && (user.pins = user.pins.length)

            if (board.collaborators)
                board.collaborators = board.collaborators.toString()

            return board

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} userId The user id of other user
    * @param {String} boardtitle The title of user board
    * 
    * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
    * @throws {Error} On empty or blank user id, board title or board secret
    * 
    * @returns {Board} Return user boards
    */
    retrieveOtherBoard(id, userId, boardTitle) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'boardTitle', value: boardTitle, type: String }
        ])

        return (async () => {
            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const user = await User.findById(userId).lean()

            if (!user) throw new NotFoundError(`user with id ${userId} not found`)

            const board = await Board.findOne({ user: user._id, title: boardTitle }).lean()

            board.id = board._id.toString()

            delete board._id
            delete board.__v

            board.user = board.user.toString()

            user.followers != null && (user.followers = user.followers.length)
            user.pins != null && (user.pins = user.pins.length)

            if (board.collaborators)
                board.collaborators = board.collaborators.toString()

            return board

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} userId The user id of other user
    * @param {String} boardId The id of user board
    * 
    * @throws {TypeError} On non-string user id, non-string board id or non-boolean secret
    * @throws {NotFoundError} if users or board not found
    * 
    * @returns {Board} Return user boards
    */
    retrieveCover(id, userId, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'boardId', value: boardId, type: String }
        ])

        return (async () => {
            const exists = !!await User.findById(id).countDocuments()

            if (!exists) throw new NotFoundError(`user with id ${id} not found`)

            const user = await User.findById(userId).countDocuments()

            if (!user) throw new NotFoundError(`user with id ${userId} not found`)

            const board = await Board.findById(boardId).populate('pins')

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            let pins = board.pins.map(pin => pin.multimedia)

            if (pins.length > 4) {

                function shuffle(a) {
                    for (let i = a.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [a[i], a[j]] = [a[j], a[i]];
                    }
                    return a;
                }

                shuffle(pins)
                pins = pins.slice(0, 4);

            }

            return pins

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} boardId The board id
    * 
    * @throws {TypeError} On non-string user id or non-string board id
    * @throws {Error} On empty or blank user id or board id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id or board id
    */
    removeBoard(id, boardId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'boardId', value: boardId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const board = await Board.findOne({ user: user._id, _id: boardId })

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            const pinneds = board.pins

            const pins = await Pin.find({ _id: { $in: pinneds } })

            pins.forEach(async (pin) => {
                pin.pins = pin.pins.filter(user => user.toString() !== id)
                await pin.save()
            })


            user.pins = user.pins.filter(pinned => pinned.board.toString() !== boardId)

            user.boards = user.boards.filter(board => board.toString() !== boardId)

            await user.save()

            await board.remove()
        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} boardId The board id
    * @param {String} title The board title
    * @param {String} description The board description
    * @param {String} category The board category
    * @param {String} cover The board cover
    * @param {Boolean} secret if board secret
    * @param {Array} collaborators The board collaborators
    * @param {Boolean} archive if board archive
    * 
    * @throws {TypeError} On non-string user id, non-string board title or non-boolean secret
    * @throws {Error} On empty or blank user id, board title or board secret
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */
    modifyBoard(id, boardId, title, description, category, secret, cover, collaborators, archive) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'boardId', value: boardId, type: String },
            { key: 'secret', value: secret, type: Boolean },
            { key: 'title', value: title, type: String },
            { key: 'description', value: description, type: String, optional: true },
            { key: 'category', value: category, type: String, optional: true },
            { key: 'cover', value: cover, type: String, optional: true },
            { key: 'collaborators', value: collaborators, type: Array, optional: true },
            { key: 'archive', value: archive, type: Boolean, optional: true }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const board = await Board.findOne({ user: user._id, _id: boardId })

            if (!board) throw new NotFoundError(`board with id ${boardId} not found`)

            board.title = title
            board.secret = secret
            description != null && (board.description = description)
            category != null && (board.category = category)
            cover != null && (board.cover = cover)
            archive != null && (board.archive = archive)

            if (collaborators) {
                board.collaborators = collaborators.map(collaborator => {
                    User.findById(collaborator)
                        .then(user => {
                            if (!user) throw new NotFoundError(`user with id ${id} not found`)
                            return new ObjectId(collaborator)
                        })

                })
            }
            await board.save()
        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} boardIdFrom The board id from
    * @param {String} boardIdTo The board id to
    * 
    * @throws {TypeError} On non-string user id or non-string board id
    * @throws {NotFoundError} if boards or user not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id or board id
    */
    mergeBoard(id, boardIdFrom, boardIdTo) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'boardIdFrom', value: boardIdFrom, type: String },
            { key: 'boardIdTo', value: boardIdTo, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const boardFrom = await Board.findOne({ user: user._id, _id: boardIdFrom })

            if (!boardFrom) throw new NotFoundError(`board with id ${boardId} not found`)

            const boardTo = await Board.findOne({ user: user._id, _id: boardIdTo })

            if (!boardTo) throw new NotFoundError(`board with id ${boardId} not found`)

            const boardPins = await Board.findById(boardIdFrom).populate('pins')

            const pins = boardPins.pins

            pins.forEach(pin => {
                boardTo.pins.push(pin.id)
                user.pins.forEach(_pin => {
   
                    if (_pin.pin.toString() === pin._id.toString()) {
            
                        _pin.board = boardTo._id
                    }
                })
            })

            await user.save()
            await boardTo.save()
            await boardFrom.remove()
        })()
    },

    // ---------- COMMENTS --------------//

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} content The comment content
    * 
    * @throws {TypeError} On non-string user id, non-string content or non-string pin id
    * @throws {Error} On empty or blank user id, content or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addComment(id, pinId, content) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'content', value: content, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const comment = new Comment({ user: user.id, content })

            if (!pin.comments) {
                pin.comments = [comment]
            } else pin.comments.push(comment)

            await pin.save()

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} content The comment id
    * 
    * @throws {TypeError} On non-string user id, non-string comment id or non-string pin id
    * @throws {NotFoundError} if user, pin or board not found
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */
    retrieveUserComment(id, pinId, commentId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'commentId', value: commentId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const comment = pin.comments.id(commentId)

            const _user = await User.findById(comment.user.toString())

            if (!_user) throw new NotFoundError(`user with id ${comment.user.toString()} not found`)

            return _user

        })()
    },


    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} commentId The comment id
    * @param {String} content The comment content
    * 
    * @throws {TypeError} On non-string user id, non-string content, non-string comment id or non-string pin id
    * @throws {Error} On empty or blank user id, comment id, content or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addCommentReply(id, pinId, commentId, content) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'commentId', value: commentId, type: String },
            { key: 'content', value: content, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const comment = pin.comments.id(commentId)

            if (!comment) throw new NotFoundError(`comment with id ${commentId} not found`)

            const _comment = new Comment({ user: user.id, content, replyTo: commentId })

            pin.comments.push(_comment)

            await pin.save()

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} filename The photo name
    * @param {Buffer} fileData The photo buffer
    * @param {String} content The comment content
    * 
    * @throws {TypeError} On non-string user id, non-string content, non-string filename, non-string comment id or non-string pin id
    * @throws {Error} On empty or blank user id, pin id, photo name or content
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addPhoto(id, pinId, filename, fileData, content) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'filename', value: filename, type: String },
            { key: 'content', value: content, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const multimedia = await this.uploadCloudinary(filename, fileData)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const photo = new Photo({ multimedia, user: user.id, content })

            if (!pin.photos) {
                pin.photos = [photo]
            } else pin.photos.push(photo)

            await pin.save()

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} photoId The photo id
    * @param {String} content The comment content
    * 
    * @throws {TypeError} On non-string user id, non-string content, non-string photo id or non-string pin id
    * @throws {Error} On empty or blank user id, photo id, content or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addCommentPhoto(id, pinId, photoId, content) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'photoId', value: photoId, type: String },
            { key: 'content', value: content, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const photo = pin.photos.id(photoId)

            if (!photo) throw new NotFoundError(`photo with id ${photoId} not found`)

            const comment = new Comment({ user: user.id, content })

            photo.comments.push(comment)

            await pin.save()

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} photoId The photo id
    * @param {String} commentId The comment id
    * @param {String} content The comment content
    * 
    * @throws {TypeError} On non-string user id, non-string photo id, non-string content, non-string comment id or non-string pin id
    * @throws {Error} On empty or blank user id, photo id, comment id, content or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addCommentPhotoReply(id, pinId, photoId, commentId, content) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'commentId', value: commentId, type: String },
            { key: 'content', value: content, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const photo = pin.photos.id(photoId)

            if (!photo) throw new NotFoundError(`photo with id ${photoId} not found`)

            const comment = photo.comments.id(commentId)

            if (!comment) throw new NotFoundError(`comment with id ${commentId} not found`)

            const _comment = new Comment({ user: user.id, content, replyTo: commentId })

            photo.comments.push(_comment)

            await pin.save()

        })()
    },

    /**
    * Add like to pin comment 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} commentId The comment comment id
    * 
    * @throws {TypeError} On non-string user id, non-string comment id or non-string pin id
    * @throws {Error} On empty or blank user id, comment id or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, comment id or pin id
    */

    likeComment(id, pinId, commentId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'commentId', value: commentId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const comment = pin.comments.id(commentId)

            if (comment.likes.length > 0) {
                const likes = comment.likes.length
                comment.likes = comment.likes.filter(like => like.toString() !== user.id)
                if (likes === comment.likes.length) comment.likes.push(user._id)
            } else comment.likes.push(user._id)

            await pin.save()

        })()
    },

    /**
    * Add like to photo 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} photoId The comment photoId
    * 
    * @throws {TypeError} On non-string user id, non-string photoId or non-string pin id
    * @throws {Error} On empty or blank user id, photoId or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, photoId or pin id
    */

    addLikePhoto(id, pinId, photoId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'photoId', value: photoId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const photo = pin.photos.id(photoId)

            if (!photo) throw new NotFoundError(`photo with id ${photoId} not found`)

            photo.likes.push(user._id)

            await pin.save()

        })()
    },

    /**
    * Add like to photo comment 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * @param {String} photoId The comment photoId
    * @param {String} commentId The comment commentId
    * 
    * @throws {TypeError} On non-string user id, non-string photoId or non-string pin id
    * @throws {Error} On empty or blank user id, photoId or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id, content or pin id
    */

    addLikeCommentPhoto(id, pinId, photoId, commentId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String },
            { key: 'commentId', value: commentId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId)

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            const photo = pin.photos.id(photoId)

            if (!photo) throw new NotFoundError(`photo with id ${photoId} not found`)

            const comment = photo.comments.id(commentId)

            if (!comment) throw new NotFoundError(`comment with id ${commentId} not found`)

            comment.likes.push(user._id)

            await pin.save()

        })()
    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * 
    * @throws {TypeError} On non-string user id or non-string pin id
    * @throws {Error} On empty or blank user id or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id or pin id
    */
    retrieveComments(id, pinId) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId).populate('comments').lean()

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            pin.comments.forEach(comment => {
                comment.id = comment._id.toString()
                delete comment._id
                comment.likes.forEach(like => like = like.toString())
            })

            return pin.comments

        })()

    },

    /**
    * 
    * @param {String} id The user id
    * @param {String} pinId The pin id
    * 
    * @throws {TypeError} On non-string user id or non-string pin id
    * @throws {Error} On empty or blank user id or pin id
    * 
    * @returns {Promise} Resolves on correct data, rejects on wrong user id or pin id
    */
    retrievePhotos(id, pinId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'pinId', value: pinId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const pin = await Pin.findById(pinId).populate('photos')

            if (!pin) throw new NotFoundError(`pin with id ${pinId} not found`)

            return pin.photos

        })()

    }
}

module.exports = logic