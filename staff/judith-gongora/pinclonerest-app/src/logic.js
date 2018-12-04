
const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,
    _photoUser: '',


    /**
        * Calls API in general way
        * 
        * @param {string} path  Endpoint to the user API
        * @param {string} method Method request to the API
        * @param {string} token User token to validate request (optional)
        * @param {Object} data JSON text to send to API (optional)
        * 
        *
        * 
        * @returns {Promise}
        */
    _callApi(path, method, token, data) {
        const init = {
            method,
            headers: {}
        }

        if (method !== 'GET') {
            init.headers['Content-Type'] = 'application/json; charset=utf-8'
        }

        if (token) {
            init.headers.Authorization = `Bearer ${token}`
        }

        if (data) {
            init.body = JSON.stringify(data)
        }

        return fetch(`http://localhost:5000/api/${path}`, init)
            .then(res => res.json())
    },


    /**
    * 
    * @param {string} email Given name of user
    * @param {string} password Given surname of user
    * @param {string} age Given username of user

    * 
    * @throws {Error in case of empty parameters}
    * @throws {Error in case API detects repeated username} 
    * 
    *@returns {Promise}
    */
    registerUser(email, password, age) {

        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (typeof age !== 'string') throw TypeError(`${age} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)


        if (!email.trim()) throw Error('email is empty or blank')
        if (!age.trim()) throw Error('age is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        const _age = Number(age)

        return this._callApi('users', 'POST', undefined, { email, password, _age })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    /**
     * 
     * 
     * @param {string} username Given username of user
     * @param {string} password Given password of user
     * 
     * @throws {Error in case of empty parameters}
     * @throws {Error in case API detects wrong credentials} 
     * 
     * @returns {Promise}
     * 
     * {Sets userId and Token to SessionStorage and to logic state if correct credentials}
     */
    login(email, password) {
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!email.trim()) throw Error('email is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return this._callApi('auth', 'POST', undefined, { email, password })
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },


    updateUser(name, surname, username) {

        let path = 'users/' + this._userId 

        return this._callApi(path, 'PATCH', this._token, {name, surname, username})
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    updateUserPhoto(file) {
        const body = new FormData()
        body.append('photo', file)

        let path = 'http://localhost:5000/api/users/' + this._userId + '/photo'

        return fetch(path, {
            method: 'POST',
            headers: {
                authorization: `bearer ${this._token}`
            },
            body
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    /**
   * 
   * @returns {boolean} If the user is logged in or not
   *
   */
    get loggedIn() {
        return !!this._userId
    },
    /**
    * 
    * Sets the states in logic to Initialized state
    *
    */
    logout() {

        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    /**
     * 
     * @returns {Array} of all public Pins 
     */
    listAllPins() {
        let path = 'users/' + this._userId + '/allPins'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                let sortedPins = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedPins || []
            })
    },

    listUserPins() {
        let path = 'users/' + this._userId + '/pins'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                let sortedPins = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedPins || []
            })
    },

    listOtherPins(username) {
        let path = 'users/' + this._userId + '/user/' + username + '/pins'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                let sortedPins = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedPins || []
            })
    },

    listBoardPins(boardId) {
        let path = 'users/' + this._userId + '/board/' + boardId + '/pins'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                let sortedPins = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedPins || []
            })
    },

    listOtherBoardPins(userId, boardId) {

        let path = 'users/' + this._userId + '/user/' + userId + '/board/' + boardId + '/pins'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                let sortedPins = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedPins || []
            })
    },


    retrievePinUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        let path = 'users/' + this._userId + '/pinUser/' + id
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    listBoards() {
        let path = 'users/' + this._userId + '/boards'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    listOtherBoards(username) {
        let path = 'users/' + this._userId + '/user/' + username + '/boards'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    retrieveUser() {
        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    retrieveOtherUser(username) {
        let path = 'users/' + this._userId + '/user/' + username
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },

    createPin(file, board, url, title, description) {
        const body = new FormData()
        body.append('photo', file)
        body.append('board', board)
        if (title) body.append('title', title)
        if (url) body.append('url', url)
        if (description) body.append('description', description)

        let path = 'http://localhost:5000/api/users/' + this._userId + '/pins'

        return fetch(path, {
            method: 'POST',
            headers: {
                authorization: `bearer ${this._token}`
            },
            body
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    isPinned(pinId) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/pinned'
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })
    },


    /**
     * 
     * @param {String} pinId Id of pin 
     * 
     * @throws {Error in case postId is not a String}
     * 
     * @returns {Array} of comments(string) 
     * 
     */
    retrieveComments(pinId) {

        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/comments'

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                let sortedComments = []

                if (res.data) sortedComments = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedComments || []

            })
    },

    /**
     * 
     * @param {String} pinId Id of pin 
     * 
     * @throws {Error in case postId is not a String}
     * 
     * @returns {Array} of photos(string) 
     * 
     */
    retrievePhotos(pinId) {

        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/photos'

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                let sortedComments = []

                if (res.data) sortedComments = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))

                return sortedComments || []

            })

    },

    /**
     * 
     * 
     * @param {number} pinId Id of pin
     * @param {string} content text of comment
     * 
     * 
     * @throws {Error in case postId is not a string}
     * @throws {Error in case content is not a string}
     * 
     * 
     * 
     * @returns {Promise} after setting state in logic
     * 
     * 
     */
    addComment(pinId, content) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof content !== 'string') throw TypeError(`${content} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/comment'

        return this._callApi(path, 'POST', this._token, { content })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    likeComment(pinId, commentId) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof commentId !== 'string') throw TypeError(`${commentId} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/comment/' + commentId + '/like'

        return this._callApi(path, 'PUT', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    isLiked(comment) {

        let liked = false
        comment.likes.forEach(like => {
            if (like === this._userId) liked = true
        })
        return liked
    },


    addPhoto(pinId, file, content) {
        const body = new FormData()
        body.append('photo', file)
        if (content) body.append('content', content)

        let path = 'http://localhost:5000/api/users/' + this._userId + '/pins/' + pinId + '/photo'

        return fetch(path, {
            method: 'POST',
            headers: {
                authorization: `bearer ${this._token}`
            },
            body
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    isFollowing(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/following/' + userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    followUser(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/follow/' + userId + '/user'
        return this._callApi(path, 'PATCH', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    unfollowUser(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/unfollow/' + userId + '/user'
        return this._callApi(path, 'DELETE', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    addBoard(title, secret) {
        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof secret !== 'boolean') throw TypeError(`${secret} is not a boolean`)

        let path = 'users/' + this._userId + '/boards'

        return this._callApi(path, 'POST', this._token, { title, secret })
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    savePin(pinId, boardId) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)

        let path = 'users/' + this._userId + '/pin/' + pinId + '/' + boardId

        return this._callApi(path, 'PATCH', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    removePin(pinId) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pin/' + pinId + '/remove'

        return this._callApi(path, 'DELETE', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    isMine(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (userId === this._userId) return true
        else return false
    },

    modifyPinned(pinId, boardId, description) {
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)

        let path = 'users/' + this._userId + '/pinned/' + pinId + '/board/' + boardId

        if (description.trim().length !== 0) {
          
            if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)
          
            return this._callApi(path, 'PATCH', this._token, { description })
                .then(res => {
                    if (res.error) throw Error(res.error)
                })
        } else {
            
            return this._callApi(path, 'PATCH', this._token, undefined)
                .then(res => {
                    if (res.error) throw Error(res.error)
                })
        }





    },

    modifyBoard(boardId, title, secret, description, category) {

        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)
        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof secret !== 'boolean') throw TypeError(`${secret} is not a boolean`)

        // if (description.trim().length !== 0) {
        //     if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        // }
        // if (category.trim().length !== 0) {
        //     if (typeof category !== 'string') throw TypeError(`${category} is not a string`)
        // }

        let path = 'users/' + this._userId + '/boards/' + boardId

        return this._callApi(path, 'PATCH', this._token, { title, description, category, secret })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },


    removeBoard(boardId) {
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)

        let path = 'users/' + this._userId + '/boards/' + boardId

        return this._callApi(path, 'DELETE', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    retrieveUserComment(pinId, commentId) {

        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof commentId !== 'string') throw TypeError(`${commentId} is not a string`)

        let path = 'users/' + this._userId + '/pins/' + pinId + '/comment/' + commentId

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                return res.data
            })

    },

    retrievePin(pinId) {

        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pin/' + pinId

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                return res.data
            })

    },

    retrieveBoard(boardTitle) {
        if (typeof boardTitle !== 'string') throw TypeError(`${boardTitle} is not a string`)

        let path = 'users/' + this._userId + '/board/' + boardTitle

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                return res.data
            })

    },

    retrieveCover(id, boardId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)

        let path = 'users/' + this._userId + '/user/' + id + '/board/' + boardId + '/covers'

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
              
                return res.data
            })

    },

    retrieveOtherBoard(userId, boardTitle) {

        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (typeof boardTitle !== 'string') throw TypeError(`${boardTitle} is not a string`)

        let path = 'users/' + this._userId + '/user/' + userId + '/board/' + boardTitle

        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                return res.data
            })

    }
}



export default logic
// module.exports = logic