const { Router } = require('express')
const usersController = require('../controllers/usersPrivate')

const route = Router()

route.get('/', usersController.getUserProfile)
route.patch('/', usersController.updateProfile)
route.put('/password', usersController.updatePassword)

module.exports = route
