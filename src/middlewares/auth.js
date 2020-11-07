const jwt = require('jsonwebtoken')
const responseStandard = require('../helpers/responses')

const { APP_KEY } = process.env

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length)

    try {
      const payload = jwt.verify(token, APP_KEY)

      if (payload) {
        req.user = payload
        next()
      } else {
        return responseStandard(res, 'Unauthorized', {}, 401, false)
      }
    } catch (error) {
      return responseStandard(res, error.message, {}, 500, false)
    }
  } else {
    return responseStandard(res, 'Forbidden access', {}, 403, false)
  }
}
