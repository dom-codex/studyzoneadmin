const pastquestionDb = require("../models/pastQuestion");
const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
exports.getAPastQuestion = async (req, res, next) => {
  try {
    //get  pq details from body
    const { pastquestionId, school, faculty, department, level, semester } =
      req.body;
    //get institutionIds
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    //find pastquestion
    const pastquestion = await pastquestionDb.findOne({
      where: {
        schoolId: institutionIds[0],
        facultyId: institutionIds[1],
        departmentId: institutionIds[2],
        levelId: institutionIds[3],
        pid: pastquestionId,
        semester: semester,
      },
      attributes: ["cloudId", "cloudUri", "fileName"],
    });
    if (!pastquestion) {
      return res.status(200).json({
        exists: false,
      });
    }
    return res.status(200).json({
      exists: true,
      url: pastquestion.dataValues.cloudUri,
      fileId: pastquestion.dataValues.cloudId,
      fileName: pastquestion.dataValues.fileName,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occured",
    });
  }
};
const getInstitutionIds = async (school, faculty, department, level) => {
  //get school
  const sch = await schoolDb.findOne({
    where: {
      sid: school,
    },
    attribute: ["id"],
  });
  //get faculty
  const fac = await facultyDb.findOne({
    where: {
      fid: faculty,
    },
    attribute: ["id"],
  });
  //get department
  const dept = await departmentDb.findOne({
    where: {
      did: department,
    },
    attribute: ["id"],
  });
  //get level
  const lev = await levelDb.findOne({
    where: {
      lid: level,
    },
    attribute: ["id"],
  });
  if (sch && fac && dept && lev) {
    return [
      sch.dataValues.id,
      fac.dataValues.id,
      dept.dataValues.id,
      lev.dataValues.id,
    ];
  }
  return false;
};
