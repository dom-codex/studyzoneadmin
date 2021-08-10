const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userEmail: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userRef: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  transactionRef: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  paymentMethod: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  semester: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "first",
  },
  userTxId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING,
  },
});
