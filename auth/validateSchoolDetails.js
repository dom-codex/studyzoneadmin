const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const { Op } = require("sequelize");
module.exports = async (req, res, next) => {
  try {
    const { sid, fid, did, lid } = req.body;
    const school = await schoolDb.findOne({
      where: {
        sid: sid,
      },
      attributes: ["id", "sid"],
    });
    if (!school) {
      return res.status(404).json({
        isValid: false,
        code: 404,
        message: "school does not exist",
      });
    }
    const faculty = await facultyDb.findOne({
      where: {
        [Op.and]: [{ fid: fid }, { schoolId: school.id }],
      },
    });
    if (!faculty) {
      return res.status(404).json({
        code: 404,
        isValid: false,
        message: "faculty does not exist",
      });
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
      return res.status(404).json({
        code: 404,
        isValid: false,
        message: "department does not exist",
      });
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
      return res.status(404).json({
        code: 404,
        isValid: false,
        message: "level does not exist",
      });
    }
    //if execution get to this point then validation is complete
    return res.status(200).json({
      code: 200,
      isValid: true,
      message: "validation successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
