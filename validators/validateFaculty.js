const facultyDb = require("../models/faculty");
const { Op } = require("sequelize");
exports.validateFaculty = async (req, res, next) => {
  try {
    const { school, canProceed } = req;
    const { fid } = req.query;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "school does not exist",
      });
    }
    const faculty = await facultyDb.findOne({
      where: {
        [Op.and]: [
          {
            schoolId: school.id,
          },
          {
            fid: fid,
          },
        ],
      },
    });
    if (!faculty) {
      return res.status(404).json({
        code: 400,
        message: "faculty not found",
      });
    }
    req.canProceed = true;
    req.faculty = faculty;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
