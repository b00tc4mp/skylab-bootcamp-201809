const fs = require('fs')
const uid = require('uuid/v4')

class User {
    constructor({ id, name, surname, username, password, postits }) {
        this.id = id || uid()

        this.name = name
        this.surname = surname
        this.username = username
        this.password = password

        this.postits = postits || []
    }

    save() {
        return User._collection.findOne({ id: this.id })
            .then(user => {
                if (user) {
                    return User._collection.updateOne({ id: this.id }, { $set:this})
                } else {
                    return User._collection.insertOne(this)
                }
            })
    }

    toObject() {
        const { name, surname, username, password, postits } = this

        return { name, surname, username, password, postits }
    }

    static findByUsername(_username) {
        return User._collection.findOne({ username: _username })
            .then(user => new User(user))
             }


    static findById(_id) {
        return User._collection.findOne({ id: _id })
        .then(user => new User(user))
    } 
}

User._collection = 'NO-COLLECTION'

module.exports = User