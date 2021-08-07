const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
module.exports = sequelize.define("pastquestion", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startYear: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  endYear: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pid: {
    type: Sequelize.UUID,
    allowNull: true,
    defaultValue: Sequelize.UUIDV4,
  },
  cloudId: {
    type: Sequelize.STRING,
  },
  cloudUri: {
    type: Sequelize.STRING,
  },
  semester: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "first",
  },
});
