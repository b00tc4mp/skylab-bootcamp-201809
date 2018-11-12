const fs = require('fs')
const { User, Postit } = require('../data')
const logic = require('.')

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => {
        User._file = './data/users.spec.json'
    })

    beforeEach(() => fs.writeFileSync(User._file, JSON.stringify([])))

    // afterEach(() => fs.writeFileSync(User._file, JSON.stringify([])))

    describe('user', () => {
        !false && describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', () =>
                logic.registerUser(name, surname, username, password)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        const [user] = users

                        expect(user.id).to.be.a('string')
                        expect(user.name).to.equal(name)
                        expect(user.surname).to.equal(surname)
                        expect(user.username).to.equal(username)
                        expect(user.password).to.equal(password)
                    })
            )

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        !false && describe('authenticate', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should authenticate on correct credentials', () => {
                const { username, password } = user

                return logic.authenticateUser(username, password)
                    .then(id => {
                        expect(id).to.exist
                        expect(id).to.be.a('string')

                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        const [_user] = users

                        expect(_user.id).to.equal(id)
                    })
            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        !false && describe('retrieve', () => {
            let user, postit

            beforeEach(() => {
                postit = new Postit('hello text')
                user = new User({  name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should succeed on valid id', () =>
                logic.retrieveUser(user.id)
                    .then(_user => {
                        expect(_user).not.to.be.instanceof(User)

                        const { id, name, surname, username, password, postits } = _user

                        expect(id).to.exist
                        expect(id).to.equal(user.id)
                        expect(name).to.equal(user.name)
                        expect(surname).to.equal(user.surname)
                        expect(username).to.equal(user.username)
                        expect(password).to.be.undefined
                        expect(postits).to.exist
                        expect(postits.length).to.equal(1)

                        const [_postit] = postits

                        expect(_postit.id).to.equal(postit.id)
                        expect(_postit.text).to.equal(postit.text)
                    })
            )
        })

        !false && describe('update', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should update on correct data and password', () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`
                const repeatPassword = newPassword

                return logic.updateUser(id, newName, newSurname, newUsername, newPassword, repeatPassword,  password)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        const [_user] = users

                        expect(_user.id).to.equal(id)

                        const { name, surname, username, password } = _user

                        expect(name).to.equal(newName)
                        expect(surname).to.equal(newSurname)
                        expect(username).to.equal(newUsername)
                        expect(password).to.equal(newPassword)
                    })
            })

            it('should update on correct id, name and password (other fields null)', () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                return logic.updateUser(id, newName, null, null, null, null, password)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        const [_user] = users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(newName)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    })
            })

            it('should update on correct id, surname and password (other fields null)', () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                return logic.updateUser(id, null, newSurname, null, null, null, password)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        const [_user] = users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(newSurname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    })
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, repeatPassword, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(() => {
                    user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                    fs.writeFileSync(User._file, JSON.stringify([user, user2]))
                })

                it('should update on correct data and password', () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'

                    return logic.updateUser(id, null, null, newUsername, null, password)
                        .then(() => expect(true).to.be.false)
                        .catch(err => {
                            expect(err).to.be.instanceof(AlreadyExistsError)

                            const json = fs.readFileSync(User._file)

                            const users = JSON.parse(json)

                            const [, _user] = users

                            expect(_user.id).to.equal(id)

                            expect(_user.name).to.equal(name)
                            expect(_user.surname).to.equal(surname)
                            expect(_user.username).to.equal(username)
                            expect(_user.password).to.equal(password)
                        })
                })
            })
        })
    })

    false && describe('postits', () => {
        false && describe('add', () => {
            let user, text

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                fs.writeFileSync(User._file, JSON.stringify([user]))

                text = `text-${Math.random()}`
            })

            it('should succeed on correct data', () =>
                logic.addPostit(user.id, text)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        expect(users.length).to.equal(1)

                        const [_user] = users

                        expect(_user.id).to.equal(user.id)

                        const { postits } = _user

                        expect(postits.length).to.equal(1)

                        const [postit] = postits

                        expect(postit.text).to.equal(text)
                    })
            )

            // TODO other test cases
        })

        false && describe('remove', () => {
            let user, postit

            beforeEach(() => {
                postit = new Postit('hello text')
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should succeed on correct data', () =>
                logic.removePostit(user.id, postit.id)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        expect(users.length).to.equal(1)

                        const [_user] = users

                        expect(_user.id).to.equal(user.id)

                        const { postits } = _user

                        expect(postits.length).to.equal(0)
                    })
            )
        })

        false && describe('modify', () => {
            let user, postit, newText

            beforeEach(() => {
                postit = new Postit('hello text')
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                newText = `new-text-${Math.random()}`

                fs.writeFileSync(User._file, JSON.stringify([user]))
            })

            it('should succeed on correct data', () =>
                logic.modifyPostit(user.id, postit.id, newText)
                    .then(() => {
                        const json = fs.readFileSync(User._file)

                        const users = JSON.parse(json)

                        expect(users.length).to.equal(1)

                        const [_user] = users

                        expect(_user.id).to.equal(user.id)

                        const { postits } = _user

                        expect(postits.length).to.equal(1)

                        const [postit] = postits

                        expect(postit.text).to.equal(newText)
                    })
            )
        })
    })
})