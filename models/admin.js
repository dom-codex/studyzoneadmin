const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uid: {
    type: Sequelize.UUID,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "VIEWER",
  },
  loggedIn: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  verificationCode: {
    type: Sequelize.STRING,
  },
});
