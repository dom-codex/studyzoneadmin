const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("department", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  abbr: {
    type: Sequelize.STRING,
  },
  did: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});
