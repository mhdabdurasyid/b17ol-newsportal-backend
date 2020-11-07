const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// import route
const usersRoute = require('../src/routes/users')
const authRoute = require('../src/routes/auth')

const app = express()
const { APP_PORT } = process.env

// enable CORS
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use('/uploads', express.static('assets/uploads'))

app.use('/users', usersRoute)
app.use('/auth', authRoute)

// listening on port 8080
app.listen(APP_PORT, () => {
  console.log(`App listening on port ${APP_PORT}`)
})
