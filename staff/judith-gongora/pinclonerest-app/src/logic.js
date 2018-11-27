import data from './data'
// const data = require('./data')

const { Post, Comment } = data

const logic = {
    _app: 'pintegram',
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,
    _posts: [],
    _postsUser: [],
    _postsAllUsers: [],
    _follows: [],
    _likes: [],
    _followers: [],
    _postLiked: [],
    _comments: [],
    _postsOtherUser: [],


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

        return this._callApi('users', 'POST', undefined, { app: this._app, email, password, age })
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
        this._posts = []
        this._postsUser = []
        this._postsAllUser = []
        this._likes = []
        this._follows = []
        this._followers = []
        this._userId = null
        this._token = null
        this._postLiked = []
        this._comments = []
        this._postsOtherUser = []

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

    retrieveUser() {
        let path = 'users/' + this._userId
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
    addComment(pinId, content){
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof content !== 'string') throw TypeError(`${content} is not a string`)
        
        let path = 'users/' + this._userId + '/pins/' + pinId + '/comment'

        return this._callApi(path, 'POST', this._token, { content })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
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

    isFollowing(userId){
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/following/' + userId 
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    followUser(userId){
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/follow/' + userId + '/user' 
        return this._callApi(path, 'PATCH', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    unfollowUser(userId){
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users/' + this._userId + '/unfollow/' + userId + '/user'
        return this._callApi(path, 'DELETE', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    addBoard(title, secret){
        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof secret !== 'boolean') throw TypeError(`${secret} is not a boolean`)

        let path = 'users/' + this._userId + '/boards'

        return this._callApi(path, 'POST', this._token, { title, secret })
            .then(res => {
                if (res.error) throw Error(res.error)
                return res.data
            })

    },

    savePin(pinId, boardId){
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)

        let path = 'users/' + this._userId + '/pin/' + pinId + '/' + boardId

        return this._callApi(path, 'PATCH', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    removePin(pinId){
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)

        let path = 'users/' + this._userId + '/pin/' + pinId + '/remove'

        return this._callApi(path, 'DELETE', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    isMine(userId){
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (userId === this._userId) return true
        else return false

    },

    modifyPinned(pinId, boardId, description){
        if (typeof pinId !== 'string') throw TypeError(`${pinId} is not a string`)
        if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)
        if (description.trim().length !== 0) {
            if (typeof boardId !== 'string') throw TypeError(`${boardId} is not a string`)
        }

        let path = 'users/' + this._userId + '/pinned/' + pinId + '/board/' + boardId

        return this._callApi(path, 'PATCH', this._token, description)
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },

    //---------- COMPROBADO ---------------//







    /**
     * 
     * 
     * @param {string} url  url of the ima
     * @param {string} password Given password of user
     * 
     * @throws {Error in case of empty parameters}
     * @throws {Error in case API detects wrong credentials} 
     * 
     * @returns {Promise}
     * 
     * {Sets userId and Token to SessionStorage and to logic state if correct credentials}
     */
    createPost(url, description) {
        if (typeof url !== 'string') throw TypeError(`${url} is not a string`)

        if (!url.trim()) throw Error('document is empty or blank')

        if (!description) description = ''

        this._postsUser.push(new Post(this._userId, url, description))

        let path = 'users/' + this._userId

        return this._callApi(path, 'PUT', this._token, { posts: this._postsUser })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    /**
     * 
     * 
     * @returns {Array} of Ids the user liked giving a call to the API of user data
     * 
     * 
     */
    listLikes() {
        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                return this._likes = res.data.likes || []
            })
    },
    /**
    * 
    * 
    * @param {number} postId  unique id of the post
    * 
    * 
    * @throws {Error in case postId is not a number}
    * 
    * 
    * @return {Promise}
    * Adds the post id to the state of the user and updates to the API
    * 
    * 
    */
    addLike(postId) {

        if (typeof postId !== 'number') throw TypeError(`${postId} is not a number`)

        this._likes.push(postId)

        let path = 'users/' + this._userId
        return this._callApi(path, 'PUT', this._token, { likes: this._likes })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    /**
     * 
     * 
     * @param {number} postId  unique id of the post to check if the user liked said post
     * 
     * 
     * @throws {Error in case postId is not a number}
     * 
     * 
     * @returns {boolean} according to the result
     * 
     * 
     */
    likedPost(postId) {

        if (typeof postId !== 'number') throw TypeError(`${postId} is not a number`)

        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                if (res.data.likes) {
                    let liked = res.data.likes.some(like => like === postId)
                    return liked
                }

            })

    },
    /**
   * 
   * 
   * @param {string} userId  unique id of the user 
   * 
   * 
   * @throws {Error in case postId is not a string}
   * 
   * 
   * @returns {string} string of the username given the userId
   * 
   * 
   */

    retriveUser(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                let userName = res.data.filter(user => user.id === userId)
                let name = userName[0].username
                return name || null
            })
    },
    /**  
     * 
     *
     * 
     * 
     * @returns {Array} of Post of the user 
     * 
     * 
     */
    listPosts() {

        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                let sortedUsers = []
                if (res.data.posts) sortedUsers = res.data.posts.sort(function (a, b) {
                    return b.id - a.id;
                });
                return this._postsUser = sortedUsers || []
            })
    },
    /**
    * 
    * 
    * @param {Object} user user in object form, as returned in the API 
    * 
    * 
    * @throws {Error in case user is not an object or empty}
    * 
    * 
    * 
    * 
    * @returns {Array} of Post 
    * 
    * 
    */
    listOtherPosts(user) {

        if (!(user instanceof Object)) throw Error(`${user} is not an object`)
        if (user.length !== undefined) throw Error(`${user} is not an object`)
        if (!user) throw Error('Other user is empty')

        let sortedUsers = []
        if (user.posts) sortedUsers = user.posts.sort(function (a, b) {
            return b.id - a.id
        })
        return this._postsOtherUser = sortedUsers || []

    },

    /**
    * 
    * 
    * @param {Array} postsId 
    * 
    * 
    * @throws {Error in case user is not an object or empty}
    * 
    * 
    * 
    * 
    * @returns {Array} of Post liked and updates state in logic
    * 
    * 
    */
    retrievePosts(postsId) {
        // if ( postsId instanceof Array) throw TypeError(`${postsId} is not an Array`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {

                if (res.error) throw Error(res.error)
                let postsUsers = []
                res.data.forEach(user => {
                    if (user.posts) {
                        for (let i = 0; i < user.posts.length; i++) {
                            for (let e = 0; e < postsId.length; e++) {
                                if (user.posts[i].id === postsId[e]) postsUsers.push(user.posts[i])
                            }
                        }
                    }
                })
                return this._postLiked = postsUsers || []
            })
    },
    /** 
     * 
     * 
     * @returns {Object} of the data of the logged in user
     * 
     * 
     */
    retrieveProfile() {
        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data || []
            })
    },
    /**
    * 
    * 
    * @param {string} url url of the image uploaded
    * 
    * 
    * @throws {Error in case url is not a string}
    * 
    * 
    * @returns {Promise}
    * 
    * 
    */

    addImageProfile(url) {
        if (typeof url !== 'string') throw TypeError(`${url} is not a string`)

        let path = 'users/' + this._userId
        return this._callApi(path, 'PUT', this._token, { img: url })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    /**
     * 
     * 
     * @param {string} username username of the user
     * 
     * 
     * @throws {Error in case username is not a string}
     * 
     * 
     * @returns {Object} of the searched user
     * 
     * 
     */
    searchUserByName(username) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                let userName = res.data.filter(user => user.username === username)
                let name = userName[0]
                return name || null
            })
    },
    /**
   * 
   * 
   * @param {string} text text to search
   * 
   * 
   * @throws {Error in case text is not a string}
   * 
   * 
   * @returns {Object} of users whose username includes text to search. Returns all users if text is empty
   * 
   * 
   */
    searchUsers(text) {
        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                let users = res.data.filter(user => user.username.includes(text))
                return users || null
            })
    },
    /**
     * 
     * 
     * @param {number} postId Id of post to search for number of favourites
     * 
     * 
     * @throws {Error in case postId is not a number}
     * 
     * 
     * @returns {number} of favourites said post has
     * 
     * 
     */
    likesPost(postId) {
        if (typeof postId !== 'number') throw TypeError(`${postId} is not a number`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {

                if (res.error) throw Error(res.error)

                let countLikes = 0
                res.data.forEach(user => {

                    if (user.likes) {
                        for (let i = 0; i < user.likes.length; i++) {
                            if (user.likes[i] === postId) countLikes++
                        }
                    }
                })
                return countLikes || 0
            })
    },
    /**
 * 
 * 
 * @param {number} postId Id of post to unfavourite
 * 
 * 
 * @throws {Error in case postId is not a number}
 * 
 * 
 * @returns {Promise} 
 * 
 * 
 */

    onDeleteLike(postId) {
        if (typeof postId !== 'number') throw new TypeError(`${postId} is not a number`)
        debugger
        this._postLiked = this._postLiked.filter(post => post.id !== postId)
        let _likes = []
        this._postLiked.forEach(post => _likes.push(post.id))

        let path = 'users/' + this._userId
        return this._callApi(path, 'PUT', this._token, { likes: _likes })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },
    /**
    * 
    * 
    * @returns {Array} of Comments 
    * 
    * 
    */
    listComments() {

        let path = 'users/' + this._userId
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)

                return this._comments = res.data.comments || []
            })
    },
  
 
    /**
     * 
     * 
     * @param {number} postId Id of post to unfavourite
     * 
     * @throws {Error in case postId is not a number}
     * 
     * 
     * 
     * @returns {number} of likes the post with postId has
     * 
     * 
     */

    commentsPost(postId) {

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {

                if (res.error) throw Error(res.error)

                let countComments = 0
                res.data.forEach(user => {

                    if (user.comments) {
                        for (let i = 0; i < user.comments.length; i++) {
                            if (user.comments[i].postId === postId) countComments++
                        }
                    }
                })
                return countComments || 0
            })
    },

    /**
    * 
    * 
    * @param {number} commentId unique Id of number
    * 
    * @throws {Error in case commentId is not a number}
    * 
    * 
    * 
    * @returns {string} of username that wrote said comment.
    * 
    * 
    */
    retrieveUserComment(commentId) {

        if (typeof commentId !== 'number') throw TypeError(`${commentId} is not a string`)

        let path = 'users?app=' + this._app
        return this._callApi(path, 'GET', this._token, undefined)
            .then(res => {
                if (res.error) throw Error(res.error)
                let userComment = ''
                res.data.forEach(user => {

                    if (user.comments) {
                        for (let i = 0; i < user.comments.length; i++) {
                            if (user.comments[i].id === commentId) userComment = user.username
                        }
                    }
                })
                return userComment

            })

    },
    /**
     * 
     * 
     * @param {number} id Id of post to delete
     * 
     * @throws {Error in case id is not a number}
     * 
     * 
     * 
     * @returns {Promise} 
     * 
     * 
     */
    deletePost(id) {
        if (typeof id !== 'number') throw new TypeError(`${id} is not a number`)

        this._postsUser = this._postsUser.filter(post => post.id !== id)

        let path = 'users/' + this._userId
        return this._callApi(path, 'PUT', this._token, { posts: this._postsUser })
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    }
}

export default logic
// module.exports = logic