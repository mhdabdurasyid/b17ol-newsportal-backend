'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class news extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      news.belongsTo(models.Users, {
        foreignKey: 'author',
        as: 'Author'
      })
    }
  };
  news.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    image: DataTypes.STRING,
    author: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'news'
  })
  return news
}
