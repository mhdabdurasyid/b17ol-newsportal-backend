const responseStandard = require('../helpers/responses')
const upload = require('../helpers/upload')
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
  updateProfile: (req, res) => {
    const { id } = req.user
    const uploadImage = upload.single('image')

    const schema = Joi.object({
      email: Joi.string().email().max(255),
      name: Joi.string().max(255)
    })

    uploadImage(req, res, async (err) => {
      if (err) {
        return responseStandard(res, err.message, {}, 400, false)
      } else {
        const image = req.file
        const { error, value } = schema.validate(req.body)
        const { email, name } = value

        if (email || name || image) {
          if (error) {
            return responseStandard(res, error.message, {}, 400, false)
          } else {
            await Users.update({
              email,
              name,
              photo: image && `/uploads/${image.filename}`
            }, {
              where: {
                id
              }
            })

            return responseStandard(res, 'Update profile successfully!', {})
          }
        } else {
          return responseStandard(res, 'Require one of the input form!', {}, 400, false)
        }
      }
    })
  }
}
