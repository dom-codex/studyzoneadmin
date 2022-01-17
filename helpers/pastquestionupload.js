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
const { Dropbox } = require("dropbox")
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
    const dropbox = new Dropbox({ accessToken: process.env.dropboxToken })
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    const uploadCallBack = async (err, contents) => {
      if (err) {
        //DELETE FILE RETURN ERROR RESPONSE
        fs.unlink(pathTofile, () => {
          //SEND ERROR RESPONSE
          return res.status(500).json({
            message: "an error occurred"
          })
        })
      } else {
        //UPLOAD FILE TO CLOUD
        try{
 const uploadRes = await dropbox.filesUpload({ path: `/pastquestions/${req.fileName}`, contents: contents })
        console.log(uploadRes)
        req.uri = req.fileName; //result.secure_url
        req.fileId = "";
        next()
        }catch(e){
          console.log(e)
          res.status(500).json({
            message:"an error occurred"
          })
        }
       
      }
    }
    //READ FILE FROM UPLOADS
    fs.readFile(pathTofile, uploadCallBack)
 
  } catch (e) {
    console.log(e);
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    fs.unlink(pathTofile,(e)=>{
      if(e)console.log(e)
        res.status(500).json({
        code: 500,
        message: "an error occurred",
      }) 
    })
   
    
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
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    if (!admin) {
      return fs.unlink(pathTofile,(e)=>{
        res.status(404).json({
          message:"admin not found"
        })
      })
    }
    //check if admin has the permission
    if (admin.role != "MASTER") {
      return fs.unlink(pathTofile,(e)=>{
        res.status(400).json({
          message:"you do not have permission for this operation"
        })
      })
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
      return fs.unlink(pathTofile, (e) => {
        res.status(404).json({
          code: 404,
          message: "school not found",
        });
      });
    }
    if (!faculty) {
      return fs.unlink(pathTofile, (e) =>
        res.status(404).json({
          code: 404,
          message: "faculty not found",
        })
      );
    }
    if (!department) {
      return fs.unlink(pathTofile, (e) =>
        res.status(404).json({
          code: 404,
          message: "department not found",
        })
      );
    }
    if (!level) {
      return fs.unlink(pathTofile, (e) =>
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
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    fs.unlink(pathTofile, (e) => {
      res.status(500).json({
        code: 500,
        message: "an error occurred",
      });
    });
  }
};
