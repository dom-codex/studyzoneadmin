const keyDb = require("../models/lisenseKey");
const pricingDb = require("../models/pricing");
const schDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const { Op } = require("sequelize");
exports.validateKey = async (req, res, next) => {
  const { keys, semester } = req.body;
  const { school, faculty, department, level } = req;
  const key = await keyDb.findOne({
    where: {
      key: keys,
    },
  });
  if (!key) {
    return res.status(404).json({
      code: 404,
      message: "key not found",
      isValid: false,
    });
  }
  if (key.isUsed) {
    return res.json({
      code: 403,
      message: "key is already used",
      isValid: false,
    });
  }
  //find past question price
  const pricing = await pricingDb.findOne({
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
        {
          levelId: level.id,
        },
        {
          semester: semester,
        },
      ],
    },
  });
  if (!pricing) {
    return res.json({
      code: 400,
      message: "cannot purchase question at the moment",
    });
  }
  if (key.worth != pricing.price) {
    return res.json({
      code: 403,
      message: "key cannot be used for purchase",
    });
  }
  return res.status(200).json({
    code: 200,
    message: "validation successful",
    isValid: true,
    data: {
      value: key.worth,
    },
  });
};
exports.validateCredentials = async (req, res, next) => {
  try {
    const { sch, faculty, department, level } = req.body;
    //find school
    const school = await schDb.findOne({
      where: {
        sid: sch,
      },
      attributes: ["id", "sid"],
    });
    if (!sch) {
      return res.json({
        code: 404,
        message: "school does not exist",
      });
    }
    const facul = await facultyDb.findOne({
      where: {
        [Op.and]: [
          {
            schoolId: school.id,
          },
          { fid: faculty },
        ],
      },
      attributes: ["id", "fid"],
    });
    if (!facul) {
      return res.json({
        code: 404,
        message: "faculty does not exist",
      });
    }
    const dept = await departmentDb.findOne({
      where: {
        [Op.and]: [
          { schoolId: school.id },
          { facultyId: facul.id },
          { did: department },
        ],
      },
      attributes: ["id", "did"],
    });
    if (!dept) {
      return res.json({
        code: 404,
        message: "department does not exist",
      });
    }
    const lev = await levelDb.findOne({
      where: {
        [Op.and]: [
          { schoolId: school.id },
          { facultyId: facul.id },
          { departmentId: dept.id },
          { lid: level },
        ],
      },
      attributes: ["id", "lid"],
    });
    if (!lev) {
      return res.json({
        code: 404,
        message: "level does not exist",
      });
    }
    req.canProceed = true;
    req.school = school;
    req.faculty = facul;
    req.department = dept;
    req.level = lev;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
