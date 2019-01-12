const mongoose = require('mongoose')
const { User, Rental, Booking } = require('../data')
const logic = require('.')
const { AlreadyExistsError, ValueError } = require('../errors')
const fs = require('fs')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/bluerooms-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Rental.deleteMany(), Booking.deleteMany()]))


    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password, email, image

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
                email = `email-${Math.random()}`
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

                const res = await logic.registerUser(filename, buffer, name, surname, username, password, email, image)

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
                expect(user.email).to.equal(email)
            })

            it('should fail on undefined name', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, undefined, surname, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, '', surname, username, password, email)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, '   \t\n', surname, username, password, email)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on undefined surname', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, undefined, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty surname', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, '', username, password, email)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on blank surname', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, '   \t\n', username, password, email)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on undefined username', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, undefined, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, '', password, email)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, '   \t\n', password, email)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on undefined password', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, undefined, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, '', email)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, '   \t\n', email)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on undefined email', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, password, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty email', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, password, '')).to.throw(ValueError, 'email is empty or blank')
            })

            it('should fail on blank email', async () => {
                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.registerUser(filename, buffer, name, surname, username, password, '   \t\n')).to.throw(ValueError, 'email is empty or blank')
            })
        })

        describe('authenticate', () => {
            let user
            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com', image: "https://res.cloudinary.com/lluis09/image/upload/v1543841076/qavxlbgkt0hdsitosm1u.jpg" })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })
        })

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com', image: "https://res.cloudinary.com/lluis09/image/upload/v1543841076/qavxlbgkt0hdsitosm1u.jpg" })

                await user.save()
            })

            it('should succeed on valid id, and control (_id,__V...)', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, _id, __v, name, surname, username, password, email, image, rentals, bookings } = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(_id).not.to.exist
                expect(__v).not.to.exist
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(email).to.equal(user.email)
                expect(image).to.equal(image)
                expect(password).to.be.undefined
                expect(rentals).to.exist
                expect(bookings).to.exist
            })
        })
    })

    describe('rentals', () => {
        describe('add', () => {
            let user, title, city, street, category, image, bedrooms, shared, description, dailyRate

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com', image: 'sdgsdfgsdgsd' })

                title = `title-${Math.random()}`
                city = `city-${Math.random()}`
                category = `category-${Math.random()}`
                street = `street-${Math.random()}`
                bedrooms = 4
                shared = false
                description = `description-${Math.random()}`
                dailyRate = 125

                await user.save()
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

                const res = await logic.addRental(user.id, filename, buffer, title, city, street, category, bedrooms, shared, description, dailyRate)

                expect(res).to.be.undefined

                const rentals = await Rental.find()

                const [rental] = rentals

                expect(rental.title).to.equal(title)
                expect(rental.city).to.equal(city)
                expect(rental.street).to.equal(street)
                expect(rental.category).to.equal(category)
                expect(rental.bedrooms).to.equal(bedrooms)
                expect(rental.shared).to.equal(shared)
                expect(rental.description).to.equal(description)
                expect(rental.dailyRate).to.equal(dailyRate)
                expect(rental.bookings).to.exist
                expect(rental.user).to.exist
                expect(rental.user.toString()).to.equal(user.id)
            })

            it('should fail on undefined title', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, undefined, city, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined city', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, undefined, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined street', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, city, undefined, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined category', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, city, street, undefined, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
            })


            it('should fail on undefined bedrooms', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, city, street, category, image, undefined, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a number')
            })

            it('should fail on undefined shared', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, city, street, category, bedrooms, undefined, description, dailyRate)).to.throw(TypeError, 'undefined is not a boolean')
            })

            it('should fail on undefined description', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, title, city, street, category, bedrooms, shared, undefined, dailyRate)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty title or other cases', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, '', city, street, category, bedrooms, shared, description, dailyRate)).to.throw(ValueError, 'title is empty or blank')
            })

            it('should fail on blank title or other cases', async () => {

                const filename = './logic/avatar.png'

                const rs = fs.createReadStream(filename)

                const buffer = await new Promise((resolve, reject) => {
                    const data = []

                    rs.on('data', chunk => data.push(chunk))

                    rs.on('end', () => resolve(Buffer.concat(data)))

                    rs.on('error', err => reject(err))
                })
                expect(() => logic.addRental(user.id, filename, buffer, '   \t\n', city, street, category, bedrooms, shared, description, dailyRate)).to.throw(ValueError, 'title is empty or blank')
            })


        })

        describe('listByUserId', () => {
            let user, rental1, rental2

            beforeEach(async () => {

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'pepe@pwp.com', image: 'fgdfqwjdhkg' })
                rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123, view: true })
                rental2 = new Rental({ title: 'title2', city: 'Capital2', street: 'Main Street2', category: 'couples2', image: 'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231, view: true })

                await rental1.save()
                await rental2.save()

                user.rentals.push(rental1.id)
                user.rentals.push(rental2.id)

                await user.save()

            })

            it('should succeed on correct data', async () => {

                const rentals = await logic.listRentalByUserId(user.id)

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)

                rentals.forEach(rental => {
                    expect(rental.title).to.be.exist
                    expect(rental.city).to.be.exist
                    expect(rental.street).to.be.exist
                    expect(rental.category).to.be.exist
                    expect(rental.bedrooms).to.be.exist
                    expect(rental.shared).to.be.exist
                    expect(rental.description).to.be.exist
                    expect(rental.dailyRate).to.be.exist
                    expect(rental.bookings).to.be.exist
                    expect(rental.view).to.be.true
                });
            })

            it('must not return sensitive data', async () => {
                const rentals = await logic.listRentalByUserId(user.id)

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)

                expect(rentals._id).not.to.exist
                expect(rentals.__v).not.to.exist
                expect(_rentals._id).not.to.exist
                expect(_rentals.__v).not.to.exist
            })


            it('should fail on undefined rental id', () => {
                expect(() => logic.listRentalByUserId(undefined).to.throw(ValueError, 'undefined is not a string'))
            })

            it('should fail on empty rental id', () => {
                expect(() => logic.listRentalByUserId('').to.throw(ValueError, 'rentalId is empty or blank'))
            })

            it('should fail on blank rental id', () => {
                expect(() => logic.listRentalByUserId('   \n').to.throw(ValueError, 'rentalId is empty or blank'))
            })

        })

        describe('retriveRentals', () => {
            let rental1, rental2

            beforeEach(async () => {

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'pepe@pwp.com', image: 'fgdfqwjdhkg' })
                rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123 })
                rental2 = new Rental({ title: 'title2', city: 'Capital2', street: 'Main Street2', category: 'couples2', image: 'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231 })

                await rental1.save()
                await rental2.save()

            })

            it('should succeed on correct data', async () => {

                const rentals = await logic.retriveRentals()

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)

                rentals.forEach(rentals => {
                    expect(rentals.title).to.be.exist
                    expect(rentals.city).to.be.exist
                    expect(rentals.street).to.be.exist
                    expect(rentals.category).to.be.exist
                    expect(rentals.bedrooms).to.be.exist
                    expect(rentals.shared).to.be.exist
                    expect(rentals.description).to.be.exist
                    expect(rentals.dailyRate).to.be.exist
                    expect(rentals.bookings).to.be.exist
                });
            })

            it('must not return sensitive data', async () => {
                const rentals = await logic.retriveRentals()

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)

                expect(rentals._id).not.to.exist
                expect(rentals.__v).not.to.exist
                expect(_rentals._id).not.to.exist
                expect(_rentals.__v).not.to.exist
            })

        })

        describe('listRentalByRentalId', () => {
            let user, rental1, rental2

            beforeEach(async () => {

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'pepe@pwp.com', image: 'fgdfqwjdhkg' })
                rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123 })
                rental2 = new Rental({ title: 'title2', city: 'Capital2', street: 'Main Street2', category: 'couples2', image: 'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231 })

                await rental1.save()
                await rental2.save()

                user.rentals.push(rental1.id)
                user.rentals.push(rental2.id)

                await user.save()

            })

            it('should succeed on correct data', async () => {

                const rental = await logic.listRentalByRentalId(user.id, rental1.id)


                expect(rental).not.to.be.undefined
                expect(rental.title).to.be.exist
                expect(rental.city).to.be.exist
                expect(rental.street).to.be.exist
                expect(rental.category).to.be.exist
                expect(rental.bedrooms).to.be.exist
                expect(rental.shared).to.be.exist
                expect(rental.description).to.be.exist
                expect(rental.dailyRate).to.be.exist
                expect(rental.bookings).to.be.exist
                expect(rental.image).to.be.exist
            });

            it('must not return sensitive data', async () => {
                const rental = await logic.listRentalByRentalId(user.id, rental1.id)

                expect(rental).not.to.be.undefined

                expect(rental._id).not.to.exist
                expect(rental.__v).not.to.exist
            })


            it('should fail on undefined user id', () => {
                expect(() => logic.listRentalByRentalId(undefined, rental1.id).to.throw(ValueError, 'undefined is not a string'))
            })

            it('should fail on undefined rental id', () => {
                expect(() => logic.listRentalByRentalId(user.id, undefined).to.throw(ValueError, 'undefined is not a string'))
            })

            it('should fail on empty user id', () => {
                expect(() => logic.listRentalByRentalId('', rental1.id).to.throw(ValueError, 'userId is empty or blank'))
            })

            it('should fail on empty rental id', () => {
                expect(() => logic.listRentalByRentalId(user.id, '').to.throw(ValueError, 'rentalId is empty or blank'))
            })

            it('should fail on blank user id', () => {
                expect(() => logic.listRentalByRentalId('    \n', rental1.id).to.throw(ValueError, 'userId is empty or blank'))
            })

            it('should fail on blank rental id', () => {
                expect(() => logic.listRentalByRentalId(user.id, '   \n').to.throw(ValueError, 'rentalId is empty or blank'))
            })

        })

        describe('listByQuery', () => {
            let rental1, rental2

            beforeEach(async () => {

                rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123 })
                rental2 = new Rental({ title: 'title2', city: 'Capital', street: 'Main Street2', category: 'couples2', image: 'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231 })

                await rental1.save()
                await rental2.save()

            })

            it('should succeed on correct data', async () => {
                const query = "Capital"

                const rentals = await logic.listRentalByQuery(query)

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)
            })

            it('must not return sensitive data', async () => {
                const query = "Capital"
                const rentals = await logic.listRentalByQuery(query)

                expect(rentals).not.to.be.undefined

                expect(rentals.length).to.equal(2)

                const _rentals = await Rental.find()

                expect(_rentals.length).to.equal(2)
                expect(rentals.length).to.equal(_rentals.length)

                expect(rentals._id).not.to.exist
                expect(rentals.__v).not.to.exist
                expect(_rentals._id).not.to.exist
                expect(_rentals.__v).not.to.exist
            })

        })

        describe('remove', () => {
            let user, rental1, rental2

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'pepe@pwp.com', image: 'fgdfqwjdhkg' })
                rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123 })
                rental2 = new Rental({ title: 'title2', city: 'Capital2', street: 'Main Street2', category: 'couples2', image: 'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231 })

                await rental1.save()
                await rental2.save()

                user.rentals.push(rental1.id)
                user.rentals.push(rental2.id)

                await user.save()
                
            })

            it('should succeed on correct data', async () => {
                await logic.removeRental(user.id, rental1.id)

                const _user = await User.findById(user.id)
                const _rentals = await Rental.findById(rental1.id)

                expect(_rentals.view).to.be.false
                expect(_user.rentals.length).to.equal(2)
            })

            it('should fail on undefined user id', () => {
                expect(() => logic.removeRental(undefined, rental1.id).to.throw(ValueError, 'undefined is not a string'))
            })

            it('should fail on undefined rental id', () => {
                expect(() => logic.removeRental(user.id, undefined).to.throw(ValueError, 'undefined is not a string'))
            })

            it('should fail on empty user id', () => {
                expect(() => logic.removeRental('', rental1.id).to.throw(ValueError, 'userId is empty or blank'))
            })

            it('should fail on empty rental id', () => {
                expect(() => logic.removeRental(user.id, '').to.throw(ValueError, 'rentalId is empty or blank'))
            })

            it('should fail on blank user id', () => {
                expect(() => logic.removeRental('    \n', rental1.id).to.throw(ValueError, 'userId is empty or blank'))
            })

            it('should fail on blank rental id', () => {
                expect(() => logic.removeRental(user.id, '   \n').to.throw(ValueError, 'rentalId is empty or blank'))
            })
        })
        describe('bookings', () => {
            describe('add', () => {
                let user, rental1, startAt, endAt, totalPrice, guests, days

                beforeEach(async () => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com', image: 'sdgsdfgsdgsd' })
                    user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '1232', email: 'jhon@gmail2.com', image: 'sdgsdfgsdgsd2' })
                    rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image: 'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123 })


                    startAt = `2018/12/10`
                    endAt = `2018/12/12`
                    totalPrice = 200
                    guests = 4
                    days = 2
                
                await user.save()
                await user2.save()

                rental1.user=(user2.id)

                await rental1.save()
                
                })

                it('should succeed on correct data', async () => {

                    const booking = await logic.addBooking(user.id, rental1.id, endAt, startAt, totalPrice, days, guests)

                    expect(booking).to.be.exist

                    // const rentals = await Rental.find()

                    // const [rental] = rentals

                    // expect(rental.title).to.equal(title)
                    // expect(rental.city).to.equal(city)
                    // expect(rental.street).to.equal(street)
                    // expect(rental.category).to.equal(category)
                    // expect(rental.bedrooms).to.equal(bedrooms)
                    // expect(rental.shared).to.equal(shared)
                    // expect(rental.description).to.equal(description)
                    // expect(rental.dailyRate).to.equal(dailyRate)
                    // expect(rental.bookings).to.exist
                    // expect(rental.user).to.exist
                    // expect(rental.user.toString()).to.equal(user.id)
                })
                it('should fail on undefined user id', () => {
                    expect(() => logic.addBooking(undefined, rental1.id, endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'undefined is not a string'))
                })
    
                it('should fail on undefined rental id', () => {
                    expect(() => logic.addBooking(user.id, undefined, endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'undefined is not a string'))
                })
    
                it('should fail on empty user id', () => {
                    expect(() => logic.addBooking('', rental1.id, endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'userId is empty or blank'))
                })
    
                it('should fail on empty rental id', () => {
                    expect(() => logic.addBooking(user.id, '', endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'rentalId is empty or blank'))
                })
    
                it('should fail on blank user id', () => {
                    expect(() => logic.addBooking('    \n', rental1.id, endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'userId is empty or blank'))
                })
    
                it('should fail on blank rental id', () => {
                    expect(() => logic.addBooking(user.id, '   \n', endAt, startAt, totalPrice, days, guests).to.throw(ValueError, 'rentalId is empty or blank'))
                })
            })
        })
    })


    afterEach(() => Promise.all([User.deleteMany(), Rental.deleteMany(), Booking.deleteMany()]))

    after(() => mongoose.disconnect())
})