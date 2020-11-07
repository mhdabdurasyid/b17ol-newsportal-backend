const { Router } = require('express')
const usersController = require('../controllers/usersPrivate')

const route = Router()

route.get('/', usersController.getUserProfile)

module.exports = route
