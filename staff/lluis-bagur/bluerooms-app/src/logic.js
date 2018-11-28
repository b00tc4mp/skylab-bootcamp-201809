const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

    //.......................... USER LOGIC .............................//

    registerUser(name, surname, username, password, email) {
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

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password, email })
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
        this._postits = []
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

    addRentals(title, city, street, category, image, bedrooms, shared, description, dailyRate) {
        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof city !== 'string') throw TypeError(`${city} is not a string`)
        if (typeof street !== 'string') throw TypeError(`${street} is not a string`)
        if (typeof category !== 'string') throw TypeError(`${category} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof bedrooms !== 'number') throw TypeError(`${bedrooms} is not a Number`)
        if (typeof shared !== 'boolean') throw TypeError(`${shared} is not a Boolean`)
        if (typeof image !== 'string') throw TypeError(`${image} is not a string`)
        if (typeof dailyRate !== 'number') throw TypeError(`${dailyRate} is not a Number`)


        if (!title.trim()) throw Error('title is empty or blank')
        if (!city.trim()) throw Error('city is empty or blank')
        if (!street.trim()) throw Error('street is empty or blank')
        if (!category.trim()) throw Error('category is empty or blank')
        if (!description.trim()) throw Error('text is empty or blank')
        if (!image.trim()) throw Error('image is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/rentals`, {
            method: 'POST',
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
        if (typeof image !== 'string') throw TypeError(`${image} is not a string`)
        if (typeof dailyRate !== 'number') throw TypeError(`${dailyRate} is not a Number`)

        if (!title.trim()) throw Error('title is empty or blank')
        if (!city.trim()) throw Error('city is empty or blank')
        if (!street.trim()) throw Error('street is empty or blank')
        if (!category.trim()) throw Error('category is empty or blank')
        if (!description.trim()) throw Error('text is empty or blank')
        if (!image.trim()) throw Error('image is empty or blank')

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


    // modifyPostit(id, text) {
    //     if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

    //     if (!id.trim().length) throw Error('id is empty or blank')

    //     if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

    //     if (!text.trim()) throw Error('text is empty or blank')

    //     return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json; charset=utf-8',
    //             'Authorization': `Bearer ${this._token}`
    //         },
    //         body: JSON.stringify({ text })
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             if (res.error) throw Error(res.error)
    //         })
    // },

    // movePostit(id, status) {
    //     if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

    //     if (!id.trim().length) throw Error('id is empty or blank')

    //     if (typeof status !== 'string') throw TypeError(`${status} is not a string`)

    //     if (!status.trim()) throw Error('status is empty or blank')

    //     return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json; charset=utf-8',
    //             'Authorization': `Bearer ${this._token}`
    //         },
    //         body: JSON.stringify({ status })
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             if (res.error) throw Error(res.error)
    //         })
    // },
}

// export default logic
module.exports = logic