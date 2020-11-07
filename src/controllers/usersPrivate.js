const responseStandard = require('../helpers/responses')
const Joi = require('joi')

const { Users } = require('../models')

module.exports = {
  getUserProfile: async (req, res) => {
    const { id } = req.user

    const user = await Users.findByPk(id)

    if (user) {
      return responseStandard(res, 'Found an user!', { result: user })
    } else {
      return responseStandard(res, 'User not found!', {}, 404, false)
    }
  },
  updateProfile: async (req, res) => {
    const { id } = req.user

    const schema = Joi.object({
      email: Joi.string().email().max(255),
      name: Joi.string().max(255)
    })

    const { error, value } = schema.validate(req.body)
    const { email, name } = value

    if (email || name) {
      if (error) {
        return responseStandard(res, error.message, {}, 400, false)
      } else {
        const user = await Users.update({
          email,
          name
        }, {
          where: {
            id
          }
        })
        console.log(user)

        return responseStandard(res, 'Update profile successfully!', {})
      }
    } else {
      return responseStandard(res, 'Require one of the input form!', {}, 400, false)
    }
  }
}
