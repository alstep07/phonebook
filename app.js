const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const errorHandler = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const config = require('./utils/config')

const app = express()

console.log('Connecting to ', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err}`)
  })

morgan.token('content', function (request) {
  return JSON.stringify(request.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :content'))
app.use('/api/persons', personsRouter)
app.use(errorHandler)

module.exports = app
