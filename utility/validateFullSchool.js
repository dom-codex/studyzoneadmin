const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const { Op } = require("sequelize");
module.exports = async (req) => {
  try {
    const { sid, fid, did, lid } = req.body;
    const school = await schoolDb.findOne({
      where: {
        sid: sid,
      },
      attributes: ["id", "sid","name"],
    });
    if (!school) {
      return {
        isValid: false,
        message: "school does not exist",
      };
    }
    const faculty = await facultyDb.findOne({
      where: {
        [Op.and]: [{ fid: fid }, { schoolId: school.id }],
      },
    });
    if (!faculty) {
      return {
        isValid: false,
        message: "faculty does not exist",
      };
    }
    const department = await departmentDb.findOne({
      where: {
        [Op.and]: [
          { schoolId: school.id },
          { facultyId: faculty.id },
          { did: did },
        ],
      },
    });
    if (!department) {
      return {
        code: 404,
        isValid: false,
        message: "department does not exist",
      };
    }
    const level = await levelDb.findOne({
      where: {
        [Op.and]: [
          {
            schoolId: school.id,
          },
          {
            facultyId: faculty.id,
          },
          {
            departmentId: department.id,
          },
          { lid: lid },
        ],
      },
    });
    if (!level) {
      return {
        isValid: false,
        message: "level does not exist",
      };
    }
    //if execution get to this point then validation is complete
    return {
      isValid: true,
      school: school,
      faculty: faculty,
      department: department,
      level: level,
      message: "validation successful",
    };
  } catch (e) {
    console.log(e);
    return {
      isValid: false,
      message: "an error occurred",
    };
  }
};
