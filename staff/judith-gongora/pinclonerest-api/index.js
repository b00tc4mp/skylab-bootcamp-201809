require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const package = require('./package.json')
const routerUser = require ('./routes/user')
const routerPin = require ('./routes/pin')
const routerBoard = require ('./routes/board')
const routerComment = require ('./routes/comment')
const cors = require('./utils/cors')

const { env: { PORT, MONGO_URL } } = process

mongoose.connect(MONGO_URL, { useNewUrlParser: true })

const app = express()

app.use(cors)

app.use('/api', routerUser, routerPin, routerBoard, routerComment)

app.listen(PORT, () => console.log(`${package.name} ${package.version} up and running on port ${PORT}`))
  