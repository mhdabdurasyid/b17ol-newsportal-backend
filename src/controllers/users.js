const responseStandard = require('../helpers/responses')
const bcrypt = require('bcryptjs')
const Joi = require('joi')

const { Users } = require('../models')

module.exports = {
  createUser: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(16).required(),
      name: Joi.string().max(255).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { email, password, name } = value

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)

      const data = {
        email,
        password: hashedPassword,
        name
      }

      const result = await Users.create(data)
      return responseStandard(res, 'Create user successfully', { result: result })
    }
  }
}
