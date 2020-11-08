const responseStandard = require('../helpers/responses')
const Joi = require('joi')
const qs = require('querystring')
const { Op } = require('sequelize')

const { APP_PORT, BASE_URL } = process.env

const { news } = require('../models')
const { Users } = require('../models')

Users.hasMany(news)
news.belongsTo(Users, {
  foreignKey: 'author',
  as: 'Author'
})

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
  },
  getNewsByUser: async (req, res) => {
    const { id } = req.user
    let { page, limit, search } = req.query

    if (!limit) {
      limit = 10
    } else {
      limit = parseInt(limit)
    }

    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
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
        as: 'Author',
        attributes: ['id', 'name', 'photo'],
        required: true
      },
      attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
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
