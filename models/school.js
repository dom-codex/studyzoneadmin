const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("school", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nameAbbr: {
    type: Sequelize.STRING,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "",
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "university",
  },
  sid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});
