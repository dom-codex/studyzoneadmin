const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("level", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: true,
  },
  level: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});
