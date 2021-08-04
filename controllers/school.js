const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
exports.createSchool = async (req, res, next) => {
  try {
    const canCreate = req.canCreate;
    if (!canCreate) {
      return res.status(400).json({
        code: 400,
        message: "cannot create school, try again",
      });
    }
    const { name, type, nameAbbr, icon } = req.body;
    const school = await schoolDb.create({
      name: name,
      type: type ? type : "university",
      nameAbbr: nameAbbr ? nameAbbr : null,
      icon: icon ? icon : "",
    });
    //send live notification to users
    res.status(200).json({
      code: 200,
      message: "school creation successful",
      data: {
        name: school.name,
        type: type,
        nameAbbr: nameAbbr,
        icon: icon,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.createFaculty = async (req, res, next) => {
  try {
    const canCreate = req.canCreate;
    if (!canCreate) {
      return res.status(401).json({
        code: 401,
        message: "creation unsuccessful",
      });
    }
    const { name } = req.body;
    const school = req.school;
    const faculty = await facultyDb.create({
      name: name,
      schoolId: school.id,
    });
    res.status(200).json({
      code: 200,
      message: "faculty created",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.createDepartment = async (req, res, next) => {
  try {
    const canCreate = req.canCreate;
    const school = req.school;
    const faculty = req.faculty;
    if (!canCreate) {
      return res.status(400).json({
        code: 400,
        message: "an error occured try again",
      });
    }
    if (!school && !faculty) {
      return res.status(404).json({
        code: 404,
        message: "school or faculty does not exist",
      });
    }
    const { name } = req.body;
    const department = await departmentDb.create({
      name: name,
      schoolId: school.id,
      facultyId: faculty.id,
    });
    res.status(200).json({
      code: 200,
      message: "success",
      data: {
        name: department.name,
        school: department.schoolId,
        faculty: department.facultyId,
      },
    });
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
