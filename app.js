const http = require("http");
const express = require("express");
const path = require("path");
//core impor
const cors = require("./utils/cors");
const sequelize = require("./utils/database");
const bcrypt = require("bcrypt")
const userdb = require("./utils/userDatabase");
const io = require("./socket");
//MODELS IMPORT
const admin = require("./models/admin");
const school = require("./models/school");
const faculty = require("./models/faculty");
const department = require("./models/department");
const level = require("./models/levels");
const pq = require("./models/pastQuestion");
const lisenseKey = require("./models/lisenseKey");
const withDrawalRequest = require("./models/withDrawalRequest");
const transaction = require("./models/transaction");
const utils = require("./models/utils");
const pricing = require("./models/pricing");
const testimony = require("./models/testimony");
const notification = require("./models/notification")
//custom imports
const authRoute = require("./routes/auth");
const schoolRoute = require("./routes/school");
const withdrawRoute = require("./routes/withdrawal");
const validationRoute = require("./routes/validations");
const updateRoute = require("./routes/update");
const downloadRoute = require("./routes/download");
const getRoute = require("./routes/getRoute");
const schoolDeleteRoute = require("./routes/schoolDeleteRoute");
const notificationRoute = require("./routes/notification");
const testimonyRoute = require("./routes/testimony");
const pastQuestion = require("./models/pastQuestion");
const downloadSlug = require("./models/downloadSlug");
const userRoute = require("./routes/userroutes");
const chatRoute = require("./routes/chat");
const settingsRoute = require("./routes/settings");
const app = express();
const server = http.createServer(app);

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
  const ad = await admin.findOne({
    where:{
      email:"test@test.com"
    }
  })
  if(!ad){
    const hash = bcrypt.hash(12,"123456789")
    await admin.create({
      name:"emma",
      role:"MASTER",
      email:"test@test.com",
      password:hash
    })
    const util = [
      { name: "minWithdrawal", value: "200" },
      { name: "maxWithdrawal", value: "5000" },
      { name: "freeTrialAvailable", value: "true" },
    ];
    await utils.bulkCreate(util, { validate: true });
  }

  //const users = await user.findAll();
  //console.log(users);
  //const user = await userdb.findAll();
  //  console.log(user);
  next();
});
app.use("/auth", authRoute);
app.use("/create", schoolRoute);
app.use("/withdrawal", withdrawRoute);
app.use("/validate", validationRoute);
app.use("/update", updateRoute);
app.use("/download", downloadRoute);
app.use("/get", getRoute);
app.use("/delete", schoolDeleteRoute);
app.use("/testimony", testimonyRoute);
app.use("/user", userRoute);
app.use("/notification", notificationRoute);
app.use("/chat", chatRoute);
app.use("/settings", settingsRoute);
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
level.belongsTo(department);
school.hasMany(level);
level.belongsTo(school);
faculty.hasMany(level);
level.belongsTo(faculty);
level.hasMany(pricing);
department.hasMany(pricing);
faculty.hasMany(pricing);
school.hasMany(pricing);
school.hasMany(transaction);
transaction.belongsTo(school);
faculty.hasMany(transaction);
transaction.belongsTo(faculty);
department.hasMany(transaction);
transaction.belongsTo(department);
level.hasMany(transaction);
transaction.belongsTo(level);
pastQuestion.hasMany(downloadSlug);
downloadSlug.belongsTo(pastQuestion);
//user.hasMany(lisenseKey);
//user.hasMany(withDrawalRequest);
//change price for pq db to non null
//change sales for pq db to non null
//change sales for userId db to non null
//change isUser for keys db to non null
sequelize.sync().then(() => {
  server.listen(process.env.PORT);
 io.init(server);

  console.log("listening...");
});
