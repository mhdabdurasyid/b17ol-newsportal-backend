const { Router } = require('express')
const newsController = require('../controllers/newsPrivate')

const route = Router()

route.post('/', newsController.postNews)
route.put('/:newsId', newsController.editNews)
route.delete('/:newsId', newsController.deleteNews)

module.exports = route
