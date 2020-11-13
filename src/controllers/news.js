const responseStandard = require('../helpers/responses')
const qs = require('querystring')
const { Op } = require('sequelize')
const Joi = require('joi')

const { APP_PORT, BASE_URL } = process.env

const { news, sequelize, Users } = require('../models')

module.exports = {
  getAllNews: async (req, res) => {
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
        as: 'Author',
        attributes: ['id', 'name', 'photo'],
        required: true
      },
      attributes: ['id', 'title', [sequelize.fn('substr', sequelize.col('news.content'), 1, 200), 'content'], 'image', 'createdAt', 'updatedAt'],
      where: {
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
        pageInfo.nextLink = `${BASE_URL}:${APP_PORT}/news?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      }

      if (currentPage > 1) {
        pageInfo.prevLink = `${BASE_URL}:${APP_PORT}/news?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      }

      return responseStandard(res, 'List of news!', { pageInfo, result: getNews })
    } else {
      return responseStandard(res, 'There is no news!', {}, 404, false)
    }
  },
  getNewsById: async (req, res) => {
    const { id } = req.params

    const schema = Joi.object({
      id: Joi.number().integer().min(1)
    })

    const { error, value } = schema.validate({ id: id })

    if (error) {
      return responseStandard(res, error.message, {}, 400, false)
    } else {
      const { id } = value
      const getNews = await news.findByPk(id, {
        include: {
          model: Users,
          as: 'Author',
          attributes: ['id', 'name', 'photo'],
          required: true
        },
        attributes: ['id', 'title', 'content', 'image', 'createdAt', 'updatedAt']
      })

      if (getNews) {
        return responseStandard(res, 'Get a news!', { result: getNews })
      } else {
        return responseStandard(res, 'News not found!', {}, 404, false)
      }
    }
  }
}
