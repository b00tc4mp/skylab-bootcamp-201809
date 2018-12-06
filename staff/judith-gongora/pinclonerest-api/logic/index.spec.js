require('dotenv').config()

const mongoose = require('mongoose')
const { User, Pin, CommentPin, Board, Photos } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')
const fs = require('fs')
const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {

    before(() => mongoose.connect('mongodb://localhost/pinclonerest-test', { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Pin.deleteMany(), Board.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Pin.deleteMany(), Board.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let email, password, age

            beforeEach(() => {
                email = `email-${Math.random()}@pinclonerest.com` 
                password = `password-${Math.random()}`
                age = 18
            })

             it('should succeed on correct data', async () => {
                const res = await logic.registerUser(email, password, age)

                expect(res).to.be.undefined

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.id).to.be.a('string')
                expect(user.email).to.equal(email)
                expect(user.age).to.equal(age)
                expect(user.password).to.equal(password)
            })

            it('should fail on undefined name', async () => {
                expect(() => logic.registerUser(undefined, password, age).to.throw(TypeError, 'email is not a string'))
            })

            // TODO other test cases
        })

        describe('authenticate', () => {
            let user

            beforeEach(() => (user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })).save())

            it('should authenticate on correct credentials', async () => {
                const { email, password } = user

                const id = await logic.authenticateUser(email, password)
                        expect(id).to.exist
                        expect(id).to.be.a('string')

                        const _users = await User.find()
                                const [_user] = _users
                                expect(_user.id).to.equal(id)
            })

            it('should fail on undefined username', async () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'email is not a string')
            })

            // TODO other test cases
        })

        describe('retrieve user', () => {
            let user, pin

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret : false})

                pin = new Pin({ multimedia: 'photo.jpg', board: board.id, user: user.id, secret:false})
                
                await board.save()
                await user.save()
                await pin.save()
            })

            it('should succeed on valid id', async () =>{ 
                const _user = await logic.retrieveUser(user.id)
                        
                        expect(_user).not.to.be.instanceof(User)
                        const { id, email, password, age, pins} = _user

                        expect(id).to.exist
                        expect(id).to.equal(user.id)
                        expect(email).to.equal(user.email)
                        expect(age).to.equal(user.age)
                        expect(password).to.be.undefined
                        expect(pins).not.to.exist
            })
        })

        describe('update', () => {
            let user

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-1@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()
            })

            it('should update on correct data and password', async () => {
                const { id } = user
 
                const newName = `name-${Math.random()}`
                const newSurname = `surname-${Math.random()}`
                const newUsername = `username-${Math.random()}`
 
                await logic.updateUser(id, newName, newSurname, newUsername)
 
                const _users = await User.find()
 
                const [_user] = _users
 
                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id } = user

                const newName = `name-${Math.random()}`

                await logic.updateUser(id, newName, null, null, null)
                    const _users = await User.find()
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(newName)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id } = user

                const newSurname = `surname-${Math.random()}`

                await logic.updateUser(id, null, newSurname, null, null)
                const _users = await User.find()
                        const [_user] = _users

                        expect(_user.id).to.equal(id)
                        expect(_user.surname).to.equal(newSurname)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {

                expect(() => logic.updateUser(undefined, null, null, null, null)).to.throw(TypeError, 'id is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach( async () => {
                    user2 = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })

                    await user2.save()

                })

                it('should update on correct data and password', async () => {
                    const { id } = user2

                    const newUsername = 'email-1'

                    try{
                        await logic.updateUser(id, null, null, newUsername, null)
                    } catch(err){

                        expect(err).to.be.instanceof(AlreadyExistsError)

                        const _user = await User.findById(id)
                        expect(_user.id).to.equal(id)

                        expect(_user.username).to.equal(username)
                    }
                })

                
            })
        })

        describe('follow User', () => {
            let user, user2

            beforeEach( async () => {
                
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
                
                user2 = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
               
                await user.save()
                await user2.save()

            })

            it('should succeed on valid ids', async () =>{ 
                await logic.followUser(user.id, user2.id)
                const _user = await User.findById(user.id).lean()
                const _user2 = await User.findById(user2.id).lean()
             
               
                expect(_user.following.length).to.equal(1)
                expect(_user2.followers.length).to.equal(1)
                // expect(_user.following[0].toString()).to.equal(user2.id)
                // expect(_user.followers[0].toString()).to.equal(user.id)
            })
        })

        describe('unfollow User', () => {
            let user, user2

            beforeEach( async () => {
                
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
                
                user2 = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
               
                await user.save()
                await user2.save()

                await logic.followUser(user.id.toString(), user2.id.toString())
            })

            it('should succeed on valid ids', async () =>{ 
                await logic.unfollowUser(user.id.toString(), user2.id.toString())
                const _user = await User.findById(user.id)
                const _user2 = await User.findById(user2.id)
                        
                expect(_user.following.length).to.equal(0)
                expect(_user2.followers.length).to.equal(0)
            })
        })

        describe('is follow?', () => {
            let user, user2

            beforeEach( async () => {
                
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
                
                user2 = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18, username: `username-${Math.random()}` })
               
                await user.save()
                await user2.save()
                await logic.followUser(user.id, user2.id)
            })

            it('should succeed on valid ids', async () =>{ 
                const follow = await logic.isFollowing(user.id, user2.id)

                expect(follow).to.equal(true)
            })
        })

        describe('add Pinned', () => {
            let user, user2, board, filename, rs, buffer, data

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()
                await  user2.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user2.id, filename, buffer, board.id, null, title, null)
                _pin = await Pin.find().lean()
            })

            it('should succeed on correct data', async () => { 
             
                await logic.savePin(user.id, _pin[0]._id.toString(), board.id)
                
                const _user = await User.findById(user.id).populate('pins')
                const [pin] = _user.pins

                expect(pin.pin.toString()).to.equal(_pin[0]._id.toString())
                expect(pin.board.toString()).to.equal(board.id.toString())

                        
            })

            it('should error if pinned exists', async () => { 
                expect(() => logic.savePin(user2.id, _pin[0]._id.toString(), board.id).to.throw(TypeError, `pin ${_pin[0]._id.toString()} already pinned`))
       
            })
        })

        describe('modify Pinned', () => {
            let user, user2, board, filename, rs, buffer, data

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()
                await  user2.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user2.id, filename, buffer, board.id, null, title, null)
                _pin = await Pin.find().lean()

                await logic.savePin(user.id, _pin[0]._id.toString(), board.id)
            })

            it('should succeed on correct data', async () => { 
                await logic.modifyPinned(user.id, _pin[0]._id.toString(), board.id, 'description')
                      
                const _user = await User.findById(user.id).populate('pins')
                const [pin] = _user.pins

                expect(pin.pin.toString()).to.equal(_pin[0]._id.toString())
                expect(pin.board.toString()).to.equal(board.id.toString())
                expect(pin.description).to.equal('description')

                        
            })

        })

        describe('retieve description of Pinned', () => {
            let user, user2, board, filename, rs, buffer, data

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()
                await  user2.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user2.id, filename, buffer, board.id, null, title, null)
                _pin = await Pin.find().lean()
                await logic.savePin(user.id, _pin[0]._id.toString(), board.id)
                await logic.modifyPinned(user.id, _pin[0]._id.toString(), board.id, 'description')
            })

            it('should succeed on correct data', async () => { 
                const result = await logic.retrieveDescriptionPinned(user.id, _pin[0]._id.toString())

                expect(result).to.equal('description')

            })

        })

        describe('modify Pinned', () => {
            let user, user2, board, filename, rs, buffer, data

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()
                await  user2.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user2.id, filename, buffer, board.id, null, title, null)
                _pin = await Pin.find().lean()

                await logic.savePin(user.id, _pin[0]._id.toString(), board.id)
            })

            it('should succeed on correct data', async () => { 
                await logic.removePinned(user.id, _pin[0]._id.toString())
                 
                const _user = await User.findById(user.id)

                expect(_user.pins.length).to.equal(0)
                        
            })

        })

    })

    describe('pins', () => {
        describe('add', () => {
            let user, board

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()
            })

            it('should succeed on correct data', async () => { 
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user.id, filename, buffer, board.id, null, title, null)
                

                    const pins = await Pin.find()
                        const [pin] = pins

                        expect(pin.user.toString()).to.equal(user.id.toString())
                        expect(pin.board.toString()).to.equal(board.id.toString())
                        expect(pin.title).to.equal(title)

                        
            })

            // TODO other test cases
        })

        describe('retrieve Pin', () => {
            let user, board, filename, rs, buffer, data

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user.id, filename, buffer, board.id, null, title, null)
               
                _pin = await Pin.find().lean()

            })

            it('should succeed on correct data', async () => { 
                const pin = await logic.retrievePin(user.id, _pin[0]._id.toString())
             
                expect(pin.id).to.equal(_pin[0]._id.toString())
                expect(pin.user).to.equal(user.id)
                expect(pin.board).to.equal(board.id)
                expect(pin.title).to.equal(title)
                       
            })

            // TODO other test cases
        })


        describe('list', () => {
            let user, board, filename, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                title = 'primer pin'

                await  user.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.listPins(user.id)
                
                    expect(pins.length).to.equal(2)

                    expect(pins.length).to.equal(pins.length)

                    const [pin, pin2] = pins

                    expect(pin.title).to.equal('title-1')

                    expect(pin2.title).to.equal('title-2')

            })
        })

        describe('list Pins of other user', () => {
            let user, user2, filename, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await logic.addBoard( user.id, 'title-1', false)

                await user2.save()

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const [board] = await Board.find()
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.listOtherPins(user2.id, user.username)

                expect(pins.length).to.equal(2)
                
                expect(pins.length).to.equal(pins.length)

                const [pin, pin2] = pins

                expect(pin.title).to.equal('title-1')

                expect(pin2.title).to.equal('title-2') 
            })
        })

        describe('retrieve pins of board', () => {
            let user, filename, board, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.retrieveBoardPins(user.id, board.id)

                expect(pins.length).to.equal(2)

            })
        })

        describe('retrieve pins of board of other user', () => {
            let user, user2, filename, board, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user2.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.retrieveOtherBoardPins(user2.id, user.id, board.id)
                
                expect(pins.length).to.equal(2)

            })
        })

        describe('is Pinned?', () => {
            let user, filename, board, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.retrieveBoardPins(user.id, board.id)
                const _board = await logic.isPinned(user.id, pins[0].id.toString())

                expect(_board.title).to.equal('title-1')

            })
        })

        describe('list all pins', () => {
            let user, filename, board, rs, buffer, data

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
                
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.listAllPins(user.id)

                expect(pins.length).to.equal(2)

            })
        })

        describe('list user of pin', () => {
            let user, user2, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user2.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                const _user = await logic.retrievePinUser(user2.id, user.id)

                expect(_user.id).to.equal(user.id)

            })
        })

        describe('remove pin', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                await logic. removePin(user.id, _pins[0]._id.toString())

                __pins = await Pin.find().lean()

                expect(__pins.length).to.equal(1)

            })
        })

        describe('modify pin', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                await logic.modifyPin(user.id, _pins[0]._id.toString(), board.id, 'description')
                debugger
                __pins = await Pin.find().lean()

                expect(__pins[0].description).to.equal('description')

            })
        })
    
    })

     describe('boards', () => {
        describe('add', () => {
            let user, title

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                title = `title-${Math.random()}`

                await  user.save()
            })

            it('should succeed on correct data', async () => { 

              await logic.addBoard( user.id, title, false)

                    const boards = await Board.find()
                    expect(boards.length).to.equal(1)
                        const [board] = boards

                        expect(board.title).to.equal(title)
                        expect(board.user.toString()).to.equal(user.id)
                        expect(board.secret).to.equal(false)
            })

            // TODO other test cases
        })

        describe('list user Boards', () => {
            let user

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()

                await logic.addBoard( user.id, 'title-1', false)
                await logic.addBoard( user.id, 'title-2', false)
                
            }) 

            it('should succeed on correct data', async () =>{ 
                const boards = await logic.listUserBoards(user.id)
                
                    expect(boards.length).to.equal(2)

                    expect(boards[0].user).to.equal(user.id)
                    expect(boards[0].title).to.equal('title-1')
                    expect(boards[0].secret).to.equal(false)

                    expect(boards[1].user).to.equal(user.id)
                    expect(boards[1].title).to.equal('title-2')
                    expect(boards[1].secret).to.equal(false)
            })
            
        })
        
        describe('list other Boards', () => {
            let user

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()
                await user2.save()

                await logic.addBoard( user2.id, 'title-1', false)
                await logic.addBoard( user2.id, 'title-2', false)
                
            }) 

            it('should succeed on correct data', async () =>{ 
                const boards = await logic.listOtherBoards(user.id, user2.username)
                
                    expect(boards.length).to.equal(2)

                    expect(boards[0].user).to.equal(user2.id)
                    expect(boards[0].title).to.equal('title-1')
                    expect(boards[0].secret).to.equal(false)

                    expect(boards[1].user).to.equal(user2.id)
                    expect(boards[1].title).to.equal('title-2')
                    expect(boards[1].secret).to.equal(false)
            })
            
        })

        describe('retrieve Board', () => {
            let user

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()

                await logic.addBoard( user.id, 'title-1', false)
                
            }) 

            it('should succeed on correct data', async () =>{ 
                const board = await logic. retrieveBoard(user.id, 'title-1')

                    expect(board.user).to.equal(user.id)
                    expect(board.title).to.equal('title-1')
                    expect(board.secret).to.equal(false)

            })
            
        })

        describe('retrieve Board of other user', () => {
            let user

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()
                await user2.save()

                await logic.addBoard( user2.id, 'title-1', false)
                
            }) 

            it('should succeed on correct data', async () =>{ 
                const board = await logic.retrieveOtherBoard(user.id, user2.id, 'title-1')

                    expect(board.user).to.equal(user2.id)
                    expect(board.title).to.equal('title-1')
                    expect(board.secret).to.equal(false)
            })
            
        })

        describe('retrieve cover of Board', () => {
            let user, board

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()
                await user2.save()

                await logic.addBoard( user2.id, 'title-1', false)
                board = await Board.find().lean()
            }) 

            it('should succeed on correct data', async () =>{ 
                const cover = await logic.retrieveCover(user.id, user2.id, board[0]._id.toString())

                    expect(cover.length).to.equal(0)
            })
            
        })

        describe('remove board', () => {
            let user, board

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()

                await logic.addBoard( user.id, 'title-1', false)
                board = await logic.retrieveBoard(user.id, 'title-1')
                 
            }) 

            it('should succeed on correct data', async () =>{ 
                await logic.removeBoard(user.id, board.id)

                const _board = await Board.findById(board.id).countDocuments()

                expect(_board).to.equal(0)

            })  
        })

        describe('modify board', () => {
            let user, board

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()

                await logic.addBoard( user.id, 'title-1', false)
                board = await logic.retrieveBoard(user.id, 'title-1')
            }) 

            it('should succeed on correct data', async () =>{ 
                await logic. modifyBoard(user.id, board.id, 'title-2', null, null, true)

                const _board = await Board.findById(board.id).lean()

                expect(_board.user.toString()).to.equal(user.id)

            })  
        })

    })

    describe('comments', () => {

        describe('add comments', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                await logic.addComment(user.id, _pins[0]._id.toString(), 'post')

                __pins = await Pin.find().lean()

                expect(__pins[0].comments.length).to.equal(1)

            })
        })

        describe('retrieve user of comment', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

                await logic.addComment(user.id, _pins[0]._id.toString(), 'post')

                __pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                const _user = await logic.retrieveUserComment(user.id, __pins[0]._id.toString(), __pins[0].comments[0]._id.toString())

                expect(_user.id).to.equal(user.id)

            })
        })

        describe('retrieve user of comment', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

                await logic.addComment(user.id, _pins[0]._id.toString(), 'post')

                __pins = await Pin.find().lean()

            })

            it('should succeed on correct data', async () =>{ 

                await logic.likeComment(user.id, __pins[0]._id.toString(), __pins[0].comments[0]._id.toString())

                ___pins = await Pin.find().lean()

                expect(___pins[0].comments[0].likes.length).to.equal(1)

            })
        })

        describe('retrieve user of comment', () => {
            let user, filename, board, rs, buffer, data, _pins

            beforeEach(async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                await logic.addBoard( user.id, 'title-1', false)

                filename = './logic/avatar.png'

                rs = fs.createReadStream(filename)

                buffer = await new Promise((resolve, reject) => {
                    data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                const _board = await Board.find()

                board = _board[0]
                
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)

                _pins = await Pin.find().lean()

                await logic.addComment(user.id, _pins[0]._id.toString(), 'post')

                __pins = await Pin.find().lean()
                
            })

            it('should succeed on correct data', async () =>{ 

                const comments = await logic.retrieveComments(user.id, __pins[0]._id.toString())
           
                expect(comments.length).to.equal(1)

            })
        })
    
    })

    after(() => mongoose.disconnect())
})