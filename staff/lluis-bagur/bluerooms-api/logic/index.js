const { User, Rental, Booking } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')




// ....................  USER LOGIC .....................//

const logic = { 
    registerUser(name, surname, username, password, email) { //REGISTER
        validate([{ key: 'name', value: name, type: String }, { key: 'surname', value: surname, type: String }, { key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }, { key: 'email', value: email, type: String }])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, surname, username, password, email })

            await user.save()
        })()
    },

    authenticateUser(username, password) { //LOGIN - AUTHENTICATIONS
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) { // RETRIEVE USER BY ID
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean().populate('rentals')

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

    updateUser(id, name, surname, username, newPassword, password, email) { // UPDATE USERS
        validate([ 
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: surname, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String, optional: true },
            { key: 'email', value: email, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    },

    //........................... RENTAL LOGIC .......................//

    // ADD RENTAL

    addRental(id, title, city, street, category, image, bedrooms, shared, description, dailyRate) {
        validate([{ key: 'id', value: id, type: String }, { key: 'title', value: title, type: String }, { key: 'city', value: city, type: String }, { key: 'street', value: street, type: String }, { key: 'category', value: category, type: String }, { key: 'image', value: image, type: String }, { key: 'bedrooms', value: bedrooms, type: String }, { key: 'shared', value: shared, type: String }, { key: 'description', value: description, type: String }, { key: 'dailyRate', value: dailyRate, type: String }])

        return (async () => {
            const user = await User.findById(id)
            debugger

            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            debugger

            rental = new Rental({ title, city, street, category, image, bedrooms, shared, description, dailyRate, user: user.id })
            await rental.save()

            user.rentals.push(rental)

            await user.save()

        })()
    },

    //EDIT RENTAL

    updateRental(id, rentalId, title, city, street, category, image, bedrooms, shared, description, dailyRate) { // UPDATE USERS
        validate([{ key: 'id', value: id, type: String }, { key: 'rentalId', value: rentalId, type: String }, { key: 'title', value: title, type: String }, { key: 'city', value: city, type: String }, { key: 'street', value: street, type: String }, { key: 'category', value: category, type: String }, { key: 'image', value: image, type: String }, { key: 'bedrooms', value: bedrooms, type: Number }, { key: 'shared', value: shared, type: Boolean }, { key: 'description', value: description, type: String }, { key: 'dailyRate', value: dailyRate, type: Number }])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const rental = await Rental.findById(rentalId)

            if (!rental) throw new NotFoundError(`Rental with id ${id} not found`)

                title != null && (rental.title = title)
                city != null && (rental.city = city)
                street != null && (rental.street = street)
                category != null && (rental.category = category)
                image != null && (rental.image = image)
                bedrooms != null && (rental.bedrooms = bedrooms)
                shared != null && (rental.shared = shared)
                description != null && (rental.description = description)
                dailyRate != null && (rental.dailyRate = dailyRate) 

                await rental.save()
        })()
    },

    //LIST RENTAL BY ID

    listRentalByUserId(id){
        
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id).populate('rentals').exec()
            
            debugger
            
            // if (!user) throw new NotFoundError(`user with id ${id} not found`)

            //     const rentals = await Promise.all(user.rentals.map(async rentalId => await Rental.findById(rentalId)))
                
                return user.rentals
    })()
    },
    
    removeRental(id, rentalId) {
            validate([
                { key: 'id', value: id, type: String },
                { key: 'rentalId', value: rentalId, type: String }
            ])
    
            return (async () => {
                const user = await User.findById(id)
    
                if (!user) throw new NotFoundError(`user with id ${id} not found`)
    
                const rental = await Rental.findById(rentalId)
    
                if (!rental) throw new NotFoundError(`postit with id ${rentalId} not found`)
    
                await rental.remove()

            })()
        },

   
       
    // addCollaborator(id, collaboratorUsername) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'collaboratorUsername', value: collaboratorUsername, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const collaborator = await User.findOne({ username: collaboratorUsername })

    //         if (!collaborator) throw new NotFoundError(`user with username ${collaboratorUsername} not found`)

    //         if (user.id === collaborator.id) throw new NotAllowedError('user cannot add himself as a collaborator')

    //         user.collaborators.forEach(_collaboratorId => {
    //             if (_collaboratorId === collaborator.id) throw new AlreadyExistsError(`user with id ${id} arleady has collaborator with id ${_collaboratorId}`)
    //         })

    //         user.collaborators.push(collaborator._id)

    //         await user.save()
    //     })()
    // },

    // listCollaborators(id) {
    //     validate([
    //         { key: 'id', value: id, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const collaborators = await Promise.all(user.collaborators.map(async collaboratorId => await User.findById(collaboratorId)))

    //         return collaborators.map(({ id, username }) => ({ id, username }))
    //     })()
    // },

    // /**
    //  * Adds a postit
    //  * 
    //  * @param {string} id The user id
    //  * @param {string} text The postit text
    //  * 
    //  * @throws {TypeError} On non-string user id, or non-string postit text
    //  * @throws {Error} On empty or blank user id or postit text
    //  * 
    //  * @returns {Promise} Resolves on correct data, rejects on wrong user id
    //  */
    // addPostit(id, text) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'text', value: text, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postit = new Postit({ text, user: user.id })

    //         await postit.save()
    //     })()
    // },

    // listPostits(id) {
    //     validate([
    //         { key: 'id', value: id, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id).lean()

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postits = await Postit.find({ user: user._id })
    //             .lean()

    //         postits.forEach(postit => {
    //             postit.id = postit._id.toString()

    //             delete postit._id

    //             postit.user = postit.user.toString()

    //             if (postit.assignedTo)
    //                 postit.assignedTo = postit.assignedTo.toString()

    //             return postit
    //         })

    //         return postits
    //     })()
    // },

    // /**
    //  * Removes a postit
    //  * 
    //  * @param {string} id The user id
    //  * @param {string} postitId The postit id
    //  * 
    //  * @throws {TypeError} On non-string user id, or non-string postit id
    //  * @throws {Error} On empty or blank user id or postit text
    //  * 
    //  * @returns {Promise} Resolves on correct data, rejects on wrong user id, or postit id
    //  */
    // removePostit(id, postitId) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'postitId', value: postitId, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postit = await Postit.findOne({ user: user._id, _id: postitId })

    //         if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

    //         await postit.remove()
    //     })()
    // },

    // modifyPostit(id, postitId, text) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'postitId', value: postitId, type: String },
    //         { key: 'text', value: text, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postit = await Postit.findOne({ user: user._id, _id: postitId })

    //         if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

    //         postit.text = text

    //         await postit.save()
    //     })()
    // },

    // movePostit(id, postitId, status) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'postitId', value: postitId, type: String },
    //         { key: 'status', value: status, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postit = await Postit.findOne({ user: user._id, _id: postitId })

    //         if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

    //         postit.status = status

    //         await postit.save()
    //     })()
    // },

    // assignPostit(id, postitId, collaboratorId) {
    //     validate([
    //         { key: 'id', value: id, type: String },
    //         { key: 'postitId', value: postitId, type: String },
    //         { key: 'collaboratorId', value: collaboratorId, type: String }
    //     ])

    //     return (async () => {
    //         const user = await User.findById(id)

    //         if (!user) throw new NotFoundError(`user with id ${id} not found`)

    //         const postit = await Postit.findOne({ user: user._id, _id: postitId })

    //         if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

    //         postit.assignedTo = collaboratorId

    //         await postit.save()
    //     })()
    // }
}

module.exports = logic