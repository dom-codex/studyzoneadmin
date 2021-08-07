const http = require("http");
const express = require("express");
//core impor
const cors = require("./utils/cors");
const sequelize = require("./utils/database");
const userdb = require("./utils/userDatabase");

//MODELS IMPORT
const admin = require("./models/admin");
const school = require("./models/school");
const faculty = require("./models/faculty");
const department = require("./models/department");
const level = require("./models/levels");
const pq = require("./models/pastQuestion");
const user = require("./models/user");
const lisenseKey = require("./models/lisenseKey");
const withDrawalRequest = require("./models/withDrawalRequest");
const utils = require("./models/utils");
//custom imports
const authRoute = require("./routes/auth");
const schoolRoute = require("./routes/school");
const withdrawRoute = require("./routes/withdrawal");
const app = express();
const server = http.createServer(app);
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
  const util = [
    { name: "minWithdrawal", value: "200" },
    { name: "maxWithdrawal", value: "5000" },
    { name: "freeTrialAvailable", value: "true" },
  ];
  //await utils.bulkCreate(util, { validate: true });
  //const users = await user.findAll();
  //console.log(users);
  //const user = await userdb.findAll();
  //  console.log(user);
  next();
});
app.use("/auth", authRoute);
app.use("/create", schoolRoute);
app.use("/withdrawal", withdrawRoute);
admin.hasMany(lisenseKey);
//admin.hasMany(school);
school.hasMany(faculty);
school.hasMany(department);
faculty.hasMany(department);
school.hasMany(pq);
faculty.hasMany(pq);
department.hasMany(pq);
level.hasMany(pq);
department.hasMany(level);
school.hasMany(level);
faculty.hasMany(level);
//user.hasMany(lisenseKey);
//user.hasMany(withDrawalRequest);
//change price for pq db to non null
//change sales for pq db to non null
//change sales for userId db to non null
sequelize.sync({ alter: true }).then(async () => {
  userdb.sync().then(() => {
    server.listen(4500);
    console.log("listening...");
  });
});
