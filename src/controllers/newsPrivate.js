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
  }
}
