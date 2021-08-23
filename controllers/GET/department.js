const departmentDb = require("../../models/department");
module.exports.fetchDepartment = async (req, res, next) => {
  try {
    const { canProceed, faculty } = req;
    const { page } = req.query;
    const limit = 10;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
      });
    }
    const departments = await departmentDb.findAll({
      limit: limit,
      offset: limit * page,
      where: {
        facultyId: faculty.id,
      },
      attributes: ["name", "did", "createdAt"],
    });
    return res.status(200).json({
      code: 200,
      departments: departments,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
    });
  }
};
