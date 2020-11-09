const responseStandard = require('../helpers/responses')
const upload = require('../helpers/upload')
const Joi = require('joi')
const qs = require('querystring')
const { Op } = require('sequelize')

const { APP_PORT, BASE_URL } = process.env

const { news } = require('../models')
const { Users } = require('../models')

Users.hasMany(news)
news.belongsTo(Users, {
  foreignKey: 'author'
})

module.exports = {
  postNews: async (req, res) => {
    const { id } = req.user
    const uploadImage = upload.single('image')

    const schema = Joi.object({
      title: Joi.string().max(255).required(),
      content: Joi.string().required()
    })

    uploadImage(req, res, async (err) => {
      if (err) {
        return responseStandard(res, err.message, {}, 400, false)
      } else {
        const image = req.file
        const { error, value } = schema.validate(req.body)
        const { title, content } = value

        if (image) {
          if (error) {
            return responseStandard(res, error.message, {}, 400, false)
          } else {
            const data = {
              title,
              content,
              image: `/uploads/${image.filename}`,
              author: id
            }

            const result = await news.create(data)
            return responseStandard(res, 'Create news successfully', { result: result })
          }
        } else {
          return responseStandard(res, 'Image field is required!', {}, 400, false)
        }
      }
    })
  },
  editNews: async (req, res) => {
    const { id } = req.user
    const { newsId } = req.params
    const uploadImage = upload.single('image')

    const schema = Joi.object({
      title: Joi.string().max(255),
      content: Joi.string()
    })

    uploadImage(req, res, async (err) => {
      if (err) {
        return responseStandard(res, err.message, {}, 400, false)
      } else {
        const image = req.file
        const { error, value } = schema.validate(req.body)
        const { title, content } = value

        if (title || content || image) {
          if (error) {
            return responseStandard(res, error.message, {}, 400, false)
          } else {
            const isEdited = await news.update({
              title,
              content,
              image: image && `/uploads/${image.filename}`
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
        } else {
          return responseStandard(res, 'Require one of the input form!', {}, 400, false)
        }
      }
    })
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
  },
  getNewsByUser: async (req, res) => {
    const { id } = req.user
    let { page, limit, search } = req.query

    if (!limit) {
      limit = 10
    } else {
      const schema = Joi.object({
        limit: Joi.number().integer().min(1)
      })

      const { error, value } = schema.validate({ limit: limit })

      if (error) {
        return responseStandard(res, error.message, {}, 400, false)
      }

      limit = value.limit
    }

    if (!page) {
      page = 1
    } else {
      const schema = Joi.object({
        page: Joi.number().integer().min(1)
      })

      const { error, value } = schema.validate({ page: page })

      if (error) {
        return responseStandard(res, error.message, {}, 400, false)
      }

      page = value.page
    }

    if (!search) {
      search = ''
    }

    const pageInfo = {
      count: 0,
      pages: 0,
      currentPage: page,
      limitPerPage: limit,
      nextLink: null,
      prevLink: null
    }

    const getNews = await news.findAll({
      include: {
        model: Users,
        attributes: ['id', 'name', 'photo'],
        required: true
      },
      attributes: ['id', 'title', 'content', 'image', 'createdAt', 'updatedAt'],
      where: {
        author: id,
        [Op.or]: [
          {
            title: {
              [Op.substring]: search
            }
          },
          {
            content: {
              [Op.substring]: search
            }
          }
        ]
      },
      order: [
        ['createdAt', 'DESC']
      ],
      limit: limit,
      offset: (page - 1) * limit
    })

    if (getNews.length) {
      const count = await news.count({
        where: {
          author: id,
          [Op.or]: [
            {
              title: {
                [Op.substring]: search
              }
            },
            {
              content: {
                [Op.substring]: search
              }
            }
          ]
        }
      })

      pageInfo.count = count
      pageInfo.pages = Math.ceil(count / limit)
      const { pages, currentPage } = pageInfo

      if (currentPage < pages) {
        pageInfo.nextLink = `${BASE_URL}:${APP_PORT}/private/news?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }

      if (currentPage > 1) {
        pageInfo.prevLink = `${BASE_URL}:${APP_PORT}/private/news?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }

      return responseStandard(res, 'List of news!', { pageInfo, result: getNews })
    } else {
      return responseStandard(res, 'There is no news!', {}, 404, false)
    }
  }
}
