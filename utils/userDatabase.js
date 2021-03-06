const Sequelize = require("sequelize");
let sequelize;
if (!process.env.DATABASE_URL) {
  sequelize = new Sequelize(
    process.env.dbName2,
    process.env.user,
    process.env.dbPassword,
    {
      // dialect: "mysql",
      port: process.env.port2,
      dialect: "postgres",
      host: process.env.host,
    }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}
module.exports = sequelize;
