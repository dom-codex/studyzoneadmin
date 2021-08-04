const adminDb = require("../models/admin");
const schoolDb = require("../models/school");
const { Op } = require("sequelize");
const facultyDb = require("../models/faculty");
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
  /*const admin = await adminDb.findOne({
    where: {
      [Op.and]: [{ email: email }, { uid: uid }],
    },
    excludes: ["password"],
  });
  /*if (!admin) {
    return res.status(404).json({
      code: 404,
      message: "invalid email",
    });
  }
  if (admin.role != "MASTER" && admin.role != "EDITOR") {
    return res.status(400).json({
      code: 400,
      message: "you do not have the permission for this operation",
    });
  }
  if (!admin.isVerfied && !admin.loggedIn) {
    return res.status(401).json({
      code: 401,
      message: "account not verified",
    });
  }*/
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
