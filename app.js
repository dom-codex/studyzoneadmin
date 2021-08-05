const http = require("http");
const express = require("express");
//core impor
const cors = require("./utils/cors");
const sequelize = require("./utils/database");
//MODELS IMPORT
const admin = require("./models/admin");
const school = require("./models/school");
const faculty = require("./models/faculty");
const department = require("./models/department");
const level = require("./models/levels");
const pq = require("./models/pastQuestion");
//custom imports
const authRoute = require("./routes/auth");
const schoolRoute = require("./routes/school");
const app = express();
const server = http.createServer(app);
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoute);
app.use("/create", schoolRoute);
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

sequelize.sync({ alter: true }).then(() => {
  server.listen(4500);
  console.log("listening...");
});
