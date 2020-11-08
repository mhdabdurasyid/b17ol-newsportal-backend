const { Router } = require('express')
const newsController = require('../controllers/newsPrivate')

const route = Router()

route.post('/', newsController.postNews)
route.put('/:newsId', newsController.editNews)

module.exports = route
