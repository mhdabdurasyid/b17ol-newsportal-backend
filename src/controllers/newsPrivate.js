const responseStandard = require('../helpers/responses')
const Joi = require('joi')

const { news } = require('../models')

module.exports = {
  postNews: async (req, res) => {
    const { id } = req.user

    const schema = Joi.object({
      title: Joi.string().max(255).required(),
      content: Joi.string().required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { title, content } = value

      const data = {
        title,
        content,
        author: id
      }

      const result = await news.create(data)
      return responseStandard(res, 'Create news successfully', { result: result })
    }
  },
  editNews: async (req, res) => {
    const { id } = req.user
    const { newsId } = req.params

    const schema = Joi.object({
      title: Joi.string().max(255).required(),
      content: Joi.string().required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { title, content } = value

      const isEdited = await news.update({
        title,
        content
      }, {
        where: {
          id: newsId,
          author: id
        }
      })

      if (isEdited[0] === 1) {
        return responseStandard(res, 'Edit news successfully!', {})
      } else {
        return responseStandard(res, 'Edit news failed!', {}, 400, false)
      }
    }
  },
  deleteNews: async (req, res) => {
    const { id } = req.user
    const { newsId } = req.params

    const isDeleted = await news.destroy({
      where: {
        id: newsId,
        author: id
      }
    })

    if (isDeleted === 1) {
      return responseStandard(res, 'Delete news successfully!', {})
    } else {
      return responseStandard(res, 'Delete news failed!', {}, 400, false)
    }
  }
}
