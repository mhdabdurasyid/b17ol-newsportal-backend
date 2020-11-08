const { Router } = require('express')
const newsController = require('../controllers/news')

const route = Router()

route.get('/', newsController.getAllNews)

module.exports = route
