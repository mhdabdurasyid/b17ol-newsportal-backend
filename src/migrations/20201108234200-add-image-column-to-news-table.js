'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('news', 'image', Sequelize.STRING, { after: 'content' })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('news', 'image')
  }
}
