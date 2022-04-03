const departmentDb = require("../../models/department");
const { limit } = require("../../utility/constants");

module.exports.fetchDepartment = async (req, res, next,forward=false) => {
  try {
    const { canProceed, faculty } = req;
    const { page } = req.query;
   // const limit = 10;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
      });
    }
    const departments = await departmentDb.findAll({
      limit: limit,
      offset: limit * (page - 1),
      order:[["id",!forward?"DESC":"ASC"]],
      where: {
        facultyId: faculty.id,
      },
      attributes: ["name", "did", "createdAt"],
    }); 
    const numberOfDepartment = await departmentDb.count({
      where:{
        facultyId:faculty.id
      }
    })
    return res.status(200).json({
      code: 200,
      departments: departments,
      numberOfDepartment
    });
   
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
    });
  }
};
