const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("util", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primarKey: true,
  },
  value: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  utilsId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
});
