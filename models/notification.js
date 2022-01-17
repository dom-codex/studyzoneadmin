const sequelize = require("../utils/database.js")
const Sequelize = require("sequelize")
module.exports = sequelize.define("notification",{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
  },
  notification:{
    type:Sequelize.STRING(10000),
    allowNull:false
  },
  subject:{
    type:Sequelize.STRING,
    allowNull:false
  },
  nid:{
    type:Sequelize.UUID,
    defaultValue:Sequelize.UUIDV4
  }
})
