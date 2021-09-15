const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("lisenseKeys", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  keyId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  forWhom: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  worth: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  usedBy: {
    type: Sequelize.UUID,
  },
  user: {
    type: Sequelize.STRING,
  },
  isUsed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});
