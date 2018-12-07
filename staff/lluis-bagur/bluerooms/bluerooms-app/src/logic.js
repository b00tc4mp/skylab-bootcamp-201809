const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

    //.......................... USER LOGIC .............................//

    registerUser(name, file, surname, username, password, email) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)


        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')
        if (!email.trim()) throw Error('email is empty or blank')


        const acceptedTypes = [
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'image/png'
          ]
        const maxSize = 200000
      
        const body = new FormData()

        if (typeof file === 'object') {
            if (!acceptedTypes.includes(file.type)) throw Error('Only images are allowed')
            if (file.size > maxSize) throw Error('Image should be 2mb maximum')
      
            body.append('photo', file)
          }

        body.append('name', name)
        body.append('surname', surname)
        body.append('username', username)
        body.append('password', password)
        body.append('email', email)


        return fetch(`${this.url}/users`, {
            method: 'POST',
           
            body
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    login(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    logout() {
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    retriveUser() {
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    //.......................... RENTALS LOGIC .............................//


    //ADD RENTALS

    addRentals(title, file, city, street, category, bedrooms, shared, description, dailyRate) {
        
        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof city !== 'string') throw TypeError(`${city} is not a string`)
        if (typeof street !== 'string') throw TypeError(`${street} is not a string`)
        if (typeof category !== 'string') throw TypeError(`${category} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof bedrooms !== 'number') throw TypeError(`${bedrooms} is not a Number`)
        if (typeof shared !== 'boolean') throw TypeError(`${shared} is not a Boolean`)
        if (typeof dailyRate !== 'number') throw TypeError(`${dailyRate} is not a Number`)

        if (!title.trim()) throw Error('title is empty or blank')
        if (!city.trim()) throw Error('city is empty or blank')
        if (!street.trim()) throw Error('street is empty or blank')
        if (!category.trim()) throw Error('category is empty or blank')
        if (!description.trim()) throw Error('text is empty or blank')

       const acceptedTypes = [
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'image/png'
          ]
        const maxSize = 200000
      
        const body = new FormData()

        if (typeof file === 'object') {
            if (!acceptedTypes.includes(file.type)) throw Error('Only images are allowed')
            if (file.size > maxSize) throw Error('Image should be 2mb maximum')
      
            body.append('photo', file)
          }

        body.append('title', title)
        body.append('city', city)
        body.append('street', street)
        body.append('category', category)
        body.append('description', description)
        body.append('bedrooms', bedrooms)
        body.append('shared', shared)
        body.append('dailyRate', dailyRate)
        

        return fetch(`${this.url}/users/${this._userId}/rentals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },
            body
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    // LIST RENTALS BY ID

    retriveRentals() {
        return fetch(`${this.url}/rentals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    retriveRental(idRental) {
        return fetch(`${this.url}/rentals/${idRental}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    listRentalByRentalId(id) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)
        if (!id.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/rentals/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    // REMOVE RENTALS

    removeRental(id) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/rentals/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    enableRental(id) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/rentals/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    editRental(id, title, city, street, category, image, bedrooms, shared, description, dailyRate) {

        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)
        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof city !== 'string') throw TypeError(`${city} is not a string`)
        if (typeof street !== 'string') throw TypeError(`${street} is not a string`)
        if (typeof category !== 'string') throw TypeError(`${category} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof bedrooms !== 'number') throw TypeError(`${bedrooms} is not a Number`)
        if (typeof shared !== 'boolean') throw TypeError(`${shared} is not a Boolean`)
        // if (typeof image !== 'string') throw TypeError(`${image} is not a string`)
        if (typeof dailyRate !== 'number') throw TypeError(`${dailyRate} is not a Number`)

        if (!title.trim()) throw Error('title is empty or blank')
        if (!city.trim()) throw Error('city is empty or blank')
        if (!street.trim()) throw Error('street is empty or blank')
        if (!category.trim()) throw Error('category is empty or blank')
        if (!description.trim()) throw Error('text is empty or blank')
        // if (!image.trim()) throw Error('image is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/rentals/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ title, city, street, category, image, bedrooms, shared, description, dailyRate })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    //SEARCH RENTALS

    searchRentals(query) {
        if (typeof query !== 'string') throw TypeError(`${query} is not a string`)

        if (!query.trim()) throw Error('query is empty or blank')

        return fetch(`${this.url}/rentals/${query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ query })
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    //ADD BOOKING

    createBooking(proposedBooking) {
        const { startAt, endAt, guests, days, totalPrice, rental } = proposedBooking;
        const rentalId = rental.id

        if (typeof startAt !== 'string') throw TypeError(`${startAt} is not a string`)
        if (typeof endAt !== 'string') throw TypeError(`${endAt} is not a string`)
        if (typeof guests !== 'number') throw TypeError(`${guests} is not a Number`)
        if (typeof days !== 'number') throw TypeError(`${days} is not a number`)
        if (typeof totalPrice !== 'number') throw TypeError(`${totalPrice} is not a Number`)

        if (!startAt.trim()) throw Error('startAt is empty or blank')
        if (!endAt.trim()) throw Error('endAt is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/rentals/${rentalId}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ startAt, endAt, guests, days, totalPrice })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data

            })
    },

}

// export default logic
module.exports = logic