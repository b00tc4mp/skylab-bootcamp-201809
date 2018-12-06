//import logic from './logic'

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const logic = require('./logic')

logic.url = 'http://localhost:5000/api'
// logic.url = 'http://192.168.0.82:5000' // DEV server!

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000


describe('logic', () => {

    describe('users', () => {
        describe('register', () => {
            let name, surname, username, password, file, email

            beforeEach(() => {
                name = `j-${Math.random()}`
                file = `'./logic/avatar.png'`
                surname = `d-${Math.random()}@gmail.com`
                username = `u-${Math.random()}`
                password = `p-${Math.random()}`
                email = `e-${Math.random()}`

            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, file, surname, username, password, email)

                expect(res).to.be.undefined
            })

            it('should fail on repeted username', async () => {
                try {
                    await logic.registerUser(name, file, surname, username, password, email)
                    // expect(true).to.be.false
                } catch (err) {
                    expect(err).to.be.instanceof(Error)
                    expect(err.message).to.equal(`username ${username} already registered`)
                }

            })

            it('should fail on repeted email', async () => {
                try {
                    await logic.registerUser(name, file, surname, username, password, email)
                    // expect(true).to.be.false
                } catch (err) {
                    expect(err).to.be.instanceof(Error)
                    expect(err.message).to.equal(`username ${email} already registered`)
                }

            })
            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, file, surname, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', file, surname, username, password, email)).to.throw(Error, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', file, surname, username, password, email)).to.throw(Error, 'name is empty or blank')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(name, file, undefined, username, password, email)).to.throw(Error, ' undefined is not a string')
            })

            it('should fail on blank surname', () => {
                expect(() => logic.registerUser(name, file, '', username, password, email)).to.throw(Error, ' is an invalid surname')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(name, file, '   \t\n', username, password, email)).to.throw(Error, 'surname is empty or blank')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(name, file, surname, undefined, password, email)).to.throw(Error, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.registerUser(name, file, surname, '', password, email)).to.throw(Error, ' is an invalid surname')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(name, file, surname, '   \t\n', password, email)).to.throw(Error, 'surname is empty or blank')
            })

        })

        describe('login', () => {
            describe('with existing user', () => {
                let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe', image = 'image', email = 'email@gmail.com'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, image, surname, username, password, email)
                })

                it('should succeed on correct data', () =>
                    logic.login(username, password)
                        .then(() => expect(true).to.be.true)
                )

                it('should fail on wrong username', () => {
                    username = `dummy-${Math.random()}`

                    return logic.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`invalid username or password`)
                        })
                })

                it('should fail on wrong password', () => {
                    password = 'pepito'

                    return logic.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal('invalid username or password')
                        })
                })
            })

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            // TODO other cases
        })

        describe('add and list collaborators', () => {
            let username, password, username2, userId2

            beforeEach(() => {
                const name = 'John', surname = 'Doe'

                username = `jd-${Math.random()}`
                password = `123-${Math.random()}`

                text = `hello ${Math.random()}`

                username2 = `pg-${Math.random()}`

                const name2 = 'Pepito', surname2 = 'Grillo', password2 = '123'

                return logic.registerUser(name, surname, username, password)
                    .then(() => logic.registerUser(name2, surname2, username2, password2))
                    .then(() => logic.login(username2, password2))
                    .then(() => {
                        userId2 = logic._userId

                        logic.logout()
                    })
                    .then(() => logic.login(username, password))
            })

            it('should succeed on correct data', () =>
                logic.addCollaborator(username2)
                    .then(res => expect(res).to.be.undefined)
                    .then(() => logic.listCollaborators())
                    .then(collaborators => {
                        expect(collaborators.length).to.equal(1)

                        const [{ id, username }] = collaborators

                        expect(id).to.equal(userId2)
                        expect(username).to.equal(username2)
                    })
            )
        })
    })
})
