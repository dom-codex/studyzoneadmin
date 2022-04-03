const schDb = require("../../models/school");
const facultyDb = require("../../models/faculty");
const extractIds = require("../../utility/extractIds");
const compileData = require("../../utility/compileSchQueryResult");
const sequelize = require("sequelize");
const { limit } = require("../../utility/constants");

exports.fetchSchoolsDetails = async (req, res, next,forward=false) => {
  try {
    const { page, type } = req.query;
    
    const schools = await schDb.findAll({
      where: {
        type: type,
      },
      limit: limit,
      order:[["id",!forward?"DESC":"ASC"]],
      offset: (page - 1) * limit,
      attributes: [
        "id",
        "name",
        "nameAbbr",
        "icon",
        "type",
        "createdAt",
        "sid",
      ],
    });
    //extract school ids
    const schoolIds = extractIds(schools);
    //find No of faculties
    const facultyInfo = await facultyDb.findAll({
      where: {
        schoolId: {
          [sequelize.Op.in]: schoolIds,
        },
      },
      group: "schoolId",
      attributes: [
        "schoolId",
        [sequelize.fn("COUNT", sequelize.col("schoolId")), "faculties"],
      ],
    });
    const data = compileData(schools, facultyInfo);
    const numberOfSchools = await schDb.count({
      where:{
        type:type
      }
    })
    res.status(200).json({
      schools: data,
      numberOfSchools:numberOfSchools,
      code: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
