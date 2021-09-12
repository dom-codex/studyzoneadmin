const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("chatList", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  lastMessage: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  group: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
