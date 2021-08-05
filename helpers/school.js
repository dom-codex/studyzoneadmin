const adminDb = require("../models/admin");
const schoolDb = require("../models/school");
const { Op } = require("sequelize");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const validateProcess = (admin, school) => {
  if (!admin) {
    return {
      err: true,
      code: 404,
      message: "invalid email",
    };
  }
  if (admin.role != "MASTER" && admin.role != "EDITOR") {
    return {
      err: true,
      code: 400,
      message: "you do not have the permission for this operation",
    };
  }
  if (!admin.isVerfied && !admin.loggedIn) {
    return {
      err: true,
      code: 401,
      message: "account not verified",
    };
  }
  if (school) {
    return {
      err: true,
      code: 400,
      message: "school exists",
    };
  }
  return {
    err: false,
    code: 200,
    message: "success",
  };
};
exports.validateSchoolCreationDetails = async (req, res, next) => {
  //validate name,
  const { email, uid, name } = req.body;

  const admin = await adminDb.findOne({
    where: {
      [Op.and]: [{ email: email }, { uid: uid }],
    },
    excludes: ["password"],
  });
  const school = await schoolDb.findOne({
    where: {
      name: name,
    },
  });
  const result = validateProcess(admin, school);
  if (result.err) {
    return res.status(result.code).json({
      code: result.code,
      message: result.message,
    });
  }
  req.canCreate = true;
  //req.admin;
  next();
};
exports.validateFacultyDetails = async (req, res, next) => {
  const { email, uid } = req.body;

  const admin = await adminDb.findOne({
    where: {
      [Op.and]: [{ email: email }, { uid: uid }],
    },
    excludes: ["password"],
  });
  const result = validateProcess(admin, false);
  if (result.err) {
    return res.status(result.code).json({
      code: result.code,
      message: result.message,
    });
  }
  //verify school
  const { sid } = req.body;
  const school = await schoolDb.findOne({
    where: {
      sid: sid,
    },
  });
  if (!school) {
    return res.status(404).json({
      code: 404,
      message: "school not found",
    });
  }
  req.canCreate = true;
  req.school = school;
  next();
};
exports.validateDepartmentCredentials = async (req, res, next) => {
  try {
    const { email, uid, fid } = req.body;

    const admin = await adminDb.findOne({
      where: {
        [Op.and]: [{ email: email }, { uid: uid }],
      },
      excludes: ["password"],
    });
    //check if admin has the necessary rights
    const result = validateProcess(admin, false);
    if (result.err) {
      return res.status(result.code).json({
        code: result.code,
        message: result.message,
      });
    }
    //verify school
    const { sid } = req.body;
    const school = await schoolDb.findOne({
      where: {
        sid: sid,
      },
    });
    if (!school) {
      return res.status(404).json({
        code: 404,
        message: "school not found",
      });
    }
    //check if faculty exists
    const faculty = await facultyDb.findOne({
      where: {
        schoolId: school.id,
        fid: fid,
      },
    });
    if (!faculty) {
      return res.status(404).json({
        code: 404,
        message: "faculty does not exist",
      });
    }
    //creation can be carried out
    req.canCreate = true;
    req.school = school;
    req.faculty = faculty;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ code: 500, message: "an error occurred" });
  }
};
exports.validateLevelCredentials = async (req, res, next) => {
  try {
    const { email, uid, sid, fid, did } = req.body; //validate admin
    const admin = await adminDb.findOne({
      where: {
        [Op.and]: [{ email: email }, { uid: uid }],
      },
      attributes: ["id", "email", "uid", "role"],
    });
    if (!admin) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    if (admin.role != "MASTER") {
      return res.status(404).json({
        code: 404,
        message: "you dont have the permission",
      });
    }
    //validate school
    const school = await schoolDb.findOne({
      where: {
        sid: sid,
      },
    });
    if (!school) {
      return res.status(404).json({
        code: 404,
        message: "school not found",
      });
    }
    //validate faculty
    const faculty = await facultyDb.findOne({
      where: { fid: fid },
    });
    if (!faculty) {
      return res.status(404).json({
        code: 404,
        message: "faculty not found",
      });
    }
    //validate department
    const department = await departmentDb.findOne({
      where: {
        did: did,
      },
    });
    if (!department) {
      return res.status(404).json({
        code: 404,
        message: "department does not exist",
      });
    }
    req.canCreate = true;
    req.admin = admin;
    req.school = school;
    req.faculty = faculty;
    req.department = department;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
