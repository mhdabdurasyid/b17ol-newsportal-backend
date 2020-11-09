const { Router } = require('express')
const newsController = require('../controllers/news')

const route = Router()

route.get('/', newsController.getAllNews)
route.get('/:id', newsController.getNewsById)

module.exports = route
