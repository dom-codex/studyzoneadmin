const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("vendor", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
  },
  vendorId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
});
