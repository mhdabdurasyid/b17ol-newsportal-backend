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

      const isEmailAvailable = await Users.findAll({
        where: { email: email }
      })

      if (isEmailAvailable.length) {
        return responseStandard(res, 'Email already registered!', {}, 403, false)
      } else {
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
  },
  isEmailValid: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { email } = value
      const user = await Users.findOne({
        attributes: ['id', 'email'],
        where: { email }
      })

      if (user) {
        return responseStandard(res, 'Found an email!', { result: user })
      } else {
        return responseStandard(res, 'Email not found!', {}, 404, false)
      }
    }
  },
  resetPassword: async (req, res) => {
    const { id } = req.params

    const schema = Joi.object({
      newPassword: Joi.string().min(6).max(16).required(),
      confirmPassword: Joi.ref('newPassword')
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { newPassword } = value
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(newPassword, salt)

      const isReset = await Users.update({ password: hashedPassword }, { where: { id } })

      if (isReset[0] === 1) {
        return responseStandard(res, 'Update password successfully!', {})
      } else {
        return responseStandard(res, 'Update password failed!', {}, 400, false)
      }
    }
  }
}
