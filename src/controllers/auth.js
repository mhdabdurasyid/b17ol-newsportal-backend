const responseStandard = require('../helpers/responses')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Users } = require('../models')
const { APP_KEY } = process.env

module.exports = {
  login: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(16).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { email, password } = value

      const isEmailValid = await Users.findAll({
        where: { email: email }
      })

      if (isEmailValid.length) {
        const isPasswordMatch = bcrypt.compareSync(password, isEmailValid[0].dataValues.password)

        if (isPasswordMatch) {
          jwt.sign({ id: isEmailValid[0].dataValues.id }, APP_KEY, { expiresIn: '7d' }, (_error, token) => {
            return responseStandard(res, 'Login success!', { token })
          })
        } else {
          return responseStandard(res, 'Wrong password!', {}, 404, false)
        }
      } else {
        return responseStandard(res, 'Email not found!', {}, 404, false)
      }
    }
  }
}
