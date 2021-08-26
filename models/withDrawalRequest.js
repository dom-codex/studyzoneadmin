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
    type: Sequelize.STRING,
  },
  requesteeName: {
    type: Sequelize.STRING,
  },
  attendedTo: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  requesteeEmail: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: "PENDING",
  },
});
