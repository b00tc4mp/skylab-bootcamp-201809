const mongoose = require('mongoose')
const { User, Rental, Booking } = require('../data')
const logic = require('.')
const { AlreadyExistsError, ValueError } = require('../errors')

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
            let name, surname, username, password, email

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
                email = `email-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password, email)

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

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', surname, username, password, email)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', surname, username, password, email)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on undefined surname', () => {
                expect(() => logic.registerUser(name, undefined, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(name, '', username, password, email)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on blank surname', () => {
                expect(() => logic.registerUser(name, '   \t\n', username, password, email)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on undefined username', () => {
                expect(() => logic.registerUser(name, surname, undefined, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(name, surname, '', password, email)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.registerUser(name, surname, '   \t\n', password, email)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.registerUser(name, surname, username, undefined, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.registerUser(name, surname, username, '', email)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.registerUser(name, surname, username, '   \t\n', email)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on undefined email', () => {
                expect(() => logic.registerUser(name, surname, username, password, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty email', () => {
                expect(() => logic.registerUser(name, surname, username, password, '')).to.throw(ValueError, 'email is empty or blank')
            })

            it('should fail on blank email', () => {
                expect(() => logic.registerUser(name, surname, username, password, '   \t\n')).to.throw(ValueError, 'email is empty or blank')
            })
        })

        describe('authenticate', () => {
            let user
            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com' })).save())

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
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com' })

                await user.save()
            })

            it('should succeed on valid id, and control (_id,__V...)', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, _id, __v, name, surname, username, password, email, rentals, bookings } = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(_id).not.to.exist
                expect(__v).not.to.exist
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(email).to.equal(user.email)
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
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'jhon@gmail.com' })

                    title = `title-${Math.random()}`
                    city = `city-${Math.random()}`
                    category = `category-${Math.random()}`
                    street = `street-${Math.random()}`
                    image = `image-${Math.random()}`
                    bedrooms = 4
                    shared = false
                    description = `description-${Math.random()}`
                    dailyRate = 125
                    
                    await user.save()
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.addRental(user.id, title, city, street, category, image, bedrooms, shared, description, dailyRate)

                    expect(res).to.be.undefined

                    const rentals = await Rental.find()

                    const [rental] = rentals

                    expect(rental.title).to.equal(title)
                    expect(rental.city).to.equal(city)
                    expect(rental.street).to.equal(street)
                    expect(rental.category).to.equal(category)
                    expect(rental.image).to.equal(image)
                    expect(rental.bedrooms).to.equal(bedrooms)
                    expect(rental.shared).to.equal(shared)
                    expect(rental.description).to.equal(description)
                    expect(rental.dailyRate).to.equal(dailyRate)
                    expect(rental.bookings).to.exist
                    expect(rental.user).to.exist
                    expect(rental.user.toString()).to.equal(user.id)
                })

                it('should fail on undefined title', () => {
                    expect(() => logic.addRental(user.id, undefined, city, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on undefined city', () => {
                    expect(() => logic.addRental(user.id, title, undefined, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on undefined street', () => {
                    expect(() => logic.addRental(user.id, title, city, undefined, category, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on undefined category', () => {
                    expect(() => logic.addRental(user.id, title, city, street, undefined, image, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on undefined image', () => {
                    expect(() => logic.addRental(user.id, title, city, street, category, undefined, bedrooms, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on undefined bedrooms', () => {
                    expect(() => logic.addRental(user.id, title, city, street, category, image, undefined, shared, description, dailyRate)).to.throw(TypeError, 'undefined is not a number')
                })

                it('should fail on undefined shared', () => {
                    expect(() => logic.addRental(user.id, title, city, street, category, image, bedrooms, undefined, description, dailyRate)).to.throw(TypeError, 'undefined is not a boolean')
                })

                it('should fail on undefined description', () => {
                    expect(() => logic.addRental(user.id, title, city, street, category, image, bedrooms, shared, undefined, dailyRate)).to.throw(TypeError, 'undefined is not a string')
                })

                it('should fail on empty title or other cases', () => {
                    expect(() => logic.addRental(user.id, '', city, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(ValueError, 'title is empty or blank')
                })

                it('should fail on blank title or other cases', () => {
                    expect(() => logic.addRental(user.id, '   \t\n', city, street, category, image, bedrooms, shared, description, dailyRate)).to.throw(ValueError, 'title is empty or blank')
                })


            })

            describe('listByUserId', () => {
                let user, rental1, rental2

                beforeEach(async () => {

                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'pepe@pwp.com' })

                    await user.save()

                    rental1 = new Rental({ title: 'title', city: 'Capital', street: 'Main Street', category: 'couples', image:'images', bedrooms: 3, shared: false, description: 'lorem ipsum...', dailyRate: 123})
                    rental2 = new Rental({ title: 'title2', city: 'Capital2', street: 'Main Street2', category: 'couples2', image:'images2', bedrooms: 31, shared: false, description: 'lorem ipsum...', dailyRate: 1231 })
                  
                    await rental1.save()
                    await rental2.save()
                })

                it('should succeed on correct data', async () => {
                    
                    
                    const rentals = await logic.listRentalByUserId(user.id)

                    console.log(rentals)

                    const _rentals = await Rental.find()

                    expect(_rentals.length).to.equal(2)
                    expect(rentals.length).to.equal(_rentals.length)

                    expect(rentals._id).not.to.exist
                    expect(rentals.__v).not.to.exist
                    expect(_rentals._id).not.to.exist
                    expect(_rentals.__v).not.to.exist

                    rentals.forEach(rentals => {
                        expect(rentals.title).to.equal(_rentals.title)
                        expect(rentals.city).to.equal(_rentals.city)
                        expect(rentals.street).to.equal(_rentals.street)
                        expect(rentals.category).to.equal(_rentals.category)
                        expect(rentals.image).to.equal(_rentals.image)
                        expect(rentals.bedrooms).to.equal(_rentals.bedrooms)
                        expect(rentals.shared).to.equal(_rentals.shared)
                        expect(rentals.description).to.equal(_rentals.description)
                        expect(rentals.dailyRate).to.equal(_rentals.dailyRate)
                        expect(rentals.bookings).to.exist
                        expect(rentals.user).to.exist
                        expect(rentals.user.toString()).to.equal(user.id)
                    });
                    
                    


                })
            })

            describe('remove', () => {
                let user, rentals

                beforeEach(async () => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    rentals = new rentals({ text: 'hello text', user: user.id })

                    await Promise.all([user.save(), rentals.save()])
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.removerentals(user.id, rentals.id)

                    expect(res).to.be.undefined

                    const rentals = await rentals.find()

                    expect(rentals.length).to.equal(0)
                })
            })

            describe('modify', () => {
                let user, rentals, newText

                beforeEach(async () => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    rentals = new rentals({ text: 'hello text', user: user.id })

                    newText = `new-text-${Math.random()}`

                    await Promise.all([user.save(), rentals.save()])
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.modifyrentals(user.id, rentals.id, newText)

                    expect(res).to.be.undefined

                    const rentals = await rentals.find()

                    expect(rentals.length).to.equal(1)

                    const [_rental] = rentals

                    expect(_rental.text).to.equal(newText)
                })
            })

            describe('move', () => {
                let user, rentals, newStatus

                beforeEach(async () => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    rentals = new rentals({ text: 'hello text', user: user.id })

                    newStatus = 'DOING'

                    await Promise.all([user.save(), rentals.save()])
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.moverentals(user.id, rentals.id, newStatus)

                    expect(res).to.be.undefined

                    const rentals = await rentals.find()

                    expect(rentals.length).to.equal(1)

                    const [_rental] = rentals

                    expect(_rental.status).to.equal(newStatus)
                })
            })

            describe('assign', () => {
                let user, rentals, user2

                beforeEach(async () => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    rentals = new rentals({ text: 'hello text', user: user.id })
                    user2 = new User({ name: 'Pepito', surname: 'Grillo', username: 'pg', password: '123' })

                    await Promise.all([user.save(), rentals.save(), user2.save()])
                })

                it('should succeed on correct data', async () => {
                    const res = await logic.assignrentals(user.id, rentals.id, user2.id)

                    expect(res).to.be.undefined

                    const rentals = await rentals.find()

                    expect(rentals.length).to.equal(1)

                    const [_rental] = rentals

                    expect(_rental.id).to.equal(rentals.id)
                    expect(_rental.user.toString()).to.equal(user.id)
                    expect(_rental.text).to.equal(rentals.text)
                    expect(_rental.assignedTo.toString()).to.equal(user2.id)
        })
    })
})

afterEach(() => Promise.all([User.deleteMany(), Rental.deleteMany(), Booking.deleteMany()]))

after(() => mongoose.disconnect())
})