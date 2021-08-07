const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("withdrawalRequest", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  wid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  requestedBy: {
    type: Sequelize.UUID,
  },
  requesteeName: {
    type: Sequelize.STRING,
  },
});
