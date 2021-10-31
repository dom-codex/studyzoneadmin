const adminDb = require("../models/admin");
const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const { Op } = require("sequelize");
const multer = require("multer");
const nanoid = require("nanoid").nanoid;
const { Storage } = require("@google-cloud/storage");
const cloudinary = require("cloudinary");
const fs = require("fs");
const path = require("path");
//function to delete fileName
const deleteFile = (fileName, cb) => {
  fs.unlink(`./uploads/${fileName}`, (e) => {
    cb();
  });
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const name = `pastquestion_${nanoid()}_${file.originalname}`;
    req.fileName = name;
    cb(null, name);
  },
  //add mime type and size filter
});
exports.upload = multer({ storage: storage }).single("pq");
exports.uploadToCloud = async (req, res, next) => {
  try {
    /*  const cstorage = new Storage({ keyFilename: "key.json" });
    const result = await cstorage
      .bucket("studyzonespark")
      .upload(`./uploads/${req.fileName}`, { destination: `${req.fileName}` });
    req.uri = result[0].metadata.selfLink;
    req.fileId = result[0].metadata.id;*/
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    /*const result = await cloudinary.v2.uploader.upload(pathTofile,{
      resource_type:"raw"
    })*/
    req.uri = req.fileName; //result.secure_url
    req.fileId = ""; //result.public_id
    next();
  } catch (e) {
    console.log(e);
    deleteFile(req.fileName, () =>
      res.status(500).json({
        code: 500,
        message: "an error occurred",
      })
    );
  }
};
exports.validateAdmin = async (req, res, next) => {
  try {
    const { lid, uid, sid, fid, did } = JSON.parse(req.body.data);

    const admin = await adminDb.findOne({
      where: {
        uid: uid,
      },
      excludes: ["password", "name"],
    });
    if (!admin) {
      return deleteFile(req.fileName, () => {
        res.status(404).json({
          code: 404,
          message: "account does not exist",
          action: "logout",
        });
      });
    }
    //check if admin has the permission
    if (admin.role != "MASTER") {
      return deleteFile(req.fileName, () => {
        res.status(400).json({
          code: 400,
          message: "you do not the required permission",
        });
      });
    }
    //validate school and faculty and department
    const school = await schoolDb.findOne({
      where: {
        sid: sid,
      },
    });
    const faculty = await facultyDb.findOne({
      where: {
        fid: fid,
      },
    });
    const department = await departmentDb.findOne({
      where: {
        did: did,
      },
    });
    const level = await levelDb.findOne({
      where: {
        lid: lid,
      },
    });
    if (!school) {
      return deleteFile(req.fileName, () => {
        res.status(404).json({
          code: 404,
          message: "school not found",
        });
      });
    }
    if (!faculty) {
      return deleteFile(req.fileName, () =>
        res.status(404).json({
          code: 404,
          message: "faculty not found",
        })
      );
    }
    if (!department) {
      return deleteFile(req.fileName, () =>
        res.status(404).json({
          code: 404,
          message: "department not found",
        })
      );
    }
    if (!level) {
      return deleteFile(req.fileName, () =>
        res.status(404).json({
          code: 404,
          message: "level not found",
        })
      );
    }
    req.canCreate = true;
    req.school = school;
    req.faculty = faculty;
    req.department = department;
    req.level = level;
    next();
  } catch (e) {
    console.log(e);
    fs.unlink(`./uploads/${req.fileName}`, () => {
      res.status(500).json({
        code: 500,
        message: "an error occurred",
      });
    });
  }
};
