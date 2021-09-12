const sequelize = require("../utils/database.js")
const Sequelize = require("sequelize")
module.exports = sequelize.define("announcement",{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true
  },
  message:{
    type:Sequelize.STRING(10000),
    allowNull:false
  },
  subject:{
    type:Sequelize.STRING,
    allowNull:false
  },
  aid:{
    type:Sequelize.UUID,
    defaultVale:Sequelize.UUID4
  }
})