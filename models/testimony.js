const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("testimony", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  videoLink: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  videoId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
