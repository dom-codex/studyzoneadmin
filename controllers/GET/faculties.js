const facultyDb = require("../../models/faculty");
const extractIds = require("../../utility/extractIds");
const departmentdb = require("../../models/department");
const sequelize = require("sequelize");
const compileData = require("../../utility/compileFacultyData");
const { limit } = require("../../utility/constants");

module.exports = async (req, res, next,forward=false) => {
  try {
    
    const { page } = req.query;
    const { school, canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "SCHOOL DOES NOT EXIST",
      });
    }
    //fetch faculties
    const faculties = await facultyDb.findAll({
      limit:limit,
      offset: (page - 1) * limit,
      order:[["id",!forward?"DESC":"ASC"]],
      where: {
        schoolId: school.id,
      },
      attributes: ["id", "name", "fid", "abbr", "createdAt"],
    });
    console.log(faculties)
    //extract ids
    const facultyIds = extractIds(faculties);
    //fetch departments
    const departmentInfo = await departmentdb.findAll({
      group: "facultyId",
      where: {
        facultyId: {
          [sequelize.Op.in]: facultyIds,
        },
      },
      attributes: [
        "facultyId",
        [sequelize.fn("COUNT", sequelize.col("facultyId")), "children"],
      ],
    });
    const data = compileData(faculties, departmentInfo);
    const numberOfFaculty = await facultyDb.count({
      where:{
        schoolId:school.id
      }
    })
    
    return res.status(200).json({
      code: 200,
      faculties: data,
      numberOfFaculty
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
