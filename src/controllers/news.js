const responseStandard = require('../helpers/responses')
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
  getAllNews: async (req, res) => {
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
  }
}
