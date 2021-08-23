const departmentDb = require("../models/department");
const sequelize = require("sequelize");
exports.validateDepartment = async (req, res, next) => {
  try {
    const { canProceed, school, faculty } = req;
    const { did } = req.query;
    if (!canProceed) {
      return res.status(400).json({
        code: 400,
        message: "something is not right",
      });
    }
    const department = await departmentDb.findOne({
      where: {
        [sequelize.Op.and]: [
          { did: did },
          { facultyId: faculty.id },
          { schoolId: school.id },
        ],
      },
    });
    if (!department) {
      return res.status(404).json({
        code: 400,
        message: "department does not exist",
      });
    }
    req.department = department;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
