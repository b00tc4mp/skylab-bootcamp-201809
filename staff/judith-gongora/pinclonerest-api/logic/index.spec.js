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
                logic.followUser(user.id.toString(), user2.id.toString())
                const user = await User.findById(user.id)
                const user2 = await User.findById(user2.id)
                        
                expect(user.following.length).to.equal(1)
                expect(user2.followers.length).to.equal(1)
                expect(user.following[0]).to.equal(user.id)
                expect(user.followers[0]).to.equal(user2.id)
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

        describe('list', () => {
            let user, pin, pin2

            beforeEach(async () => {
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                board = new Board({ user: user.id, title: 'dinners', secret: false})

                await board.save()
                
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
       
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-1', null)
                await logic.addPin( user.id, filename, buffer, board.id, null, 'title-2', null)
            })

            it('should succeed on correct data', async () =>{ 
                const pins = await logic.listPins(user.id)
                const _pins = await Pin.find()
                
                    expect(_pins.length).to.equal(2)

                    expect(pins.length).to.equal(_pins.length)

                    const [_pin, _pin2] = _pins

                    expect(_pin.id).to.equal(pin.id)
                    expect(_pin.text).to.equal(pin.text)

                    expect(_pin2.id).to.equal(pin2.id)
                    expect(_pin2.text).to.equal(pin2.text)

                    const [__pin, __pin2] = pins

                    expect(__pin).not.to.be.instanceof(Pin)
                    expect(__pin2).not.to.be.instanceof(Pin)

                    expect(_pin.id).to.equal(__pin.id)
                    expect(_pin.text).to.equal(__pin.text)

                    expect(_pin2.id).to.equal(__pin2.id)
                    expect(_pin2.text).to.equal(__pin2.text)     
            })
        })

        false && describe('remove', () => {
            let user, pin

            beforeEach(async () => {
                
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                board = new Board({ user: user.id, title: 'dinners', secret:false})
                
                await board.save()

                pin = new Pin({ multimedia: 'photo.jpg', board: board.id, user: user.id})

                await pin.save()
            })

            it('should succeed on correct data', async() => { 
                await logic.removePin(user.id, pin.id)
                    const pins = await Pin.find()
                        expect(pins.length).to.equal(0)               
            })
        })

        false && describe('modify', () => {
            let user, pin, board, board2, newDescription

            beforeEach(async () => {
                user = new User({ email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })

                await user.save()

                board = new Board({ user: user.id, title: 'dinners',secret:false})
                
                await board.save()

                board2 = new Board({ user: user.id, title: 'breakfast', secret:false})
                
                await board2.save()

                pin = new Pin({ multimedia: 'photo.jpg', board: board.id, user: user.id})

                await pin.save()

                newDescription = `description-${Math.random()}`
            })

            it('should succeed on correct data', async() =>{ 
                await logic.modifyPin(user.id, pin.id, board2.id, newDescription )
                const pins = await Pin.find()
                        expect(pins.length).to.equal(1)

                        const [_pin] = pins

                        expect(_pin.id).to.equal(pin.id)
                        expect(_pin.board.toString()).to.equal(board2.id)
                        expect(_pin.description).to.equal(newDescription)
                        
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

        describe('list User Board', () => {
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

        describe('list other Board', () => {
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

        false && describe('list other Board', () => {
            let user, board

            beforeEach( async () => {
                user = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                user2 = new User({ username: `email-${Math.random()}`, email: `email-${Math.random()}@pinclonerest.com` ,  password: `password-${Math.random()}`, age : 18 })
                
                await user.save()
                await user2.save()

                await logic.addBoard( user2.id, 'title-1', false)
                board = await logic.retrieveBoard(user.id, 'title-1')
            }) 

            it('should succeed on correct data', async () =>{ 
                const board = await logic.retrieveCover(user.id, user2.id, boardId)

                    expect(board.user).to.equal(user2.id)
                    expect(board.title).to.equal('title-1')
                    expect(board.secret).to.equal(false)
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

                const _user = User.findById(user.id)

                expect(_user.boards.length).to.equal(0)

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

                const _board = Board.findById(board.id).lean()

                expect(_board.user).to.equal(user.id)

            })  
        })

    })

    after(() => mongoose.disconnect())
})