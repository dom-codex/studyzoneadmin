const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("pricing", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNuull: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  semester: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "first",
  },
  sales: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});
