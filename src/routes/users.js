const { Router } = require('express')
const usersController = require('../controllers/users')

const route = Router()

route.post('/', usersController.createUser)
route.post('/email', usersController.isEmailValid)
route.put('/resetPassword/:id', usersController.resetPassword)

module.exports = route
