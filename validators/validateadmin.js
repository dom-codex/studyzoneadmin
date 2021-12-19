const adminDb = require("../models/admin");
const fs = require("fs")
const path = require("path")
//FILE DELETE METHOD
const deleteFile = (file,cb)=>{
  if(file){
    fs.unlink(path.join(`./uploads/${file}`),(e)=>{
    cb()
  }) 
  }
 
}
exports.validateAdminNew = async (req, res, next) => {  
    const {fileName} = req
  try {
    const { adminId } = req.body;
    const adminUser = await adminDb.findOne({
      where: {
        uid: adminId,
      },
    });
    if (!adminUser) {
      //CHECK IF FILE EXISTS
      deleteFile(fileName,()=>{
        return res.json({
        code: 404,
        message: "invalidate credentials",
      }); 
      })
     
    }
    req.admin = adminUser;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    deleteFile(fileName,()=>{
       res.status(500).json({
      code: 500,
      message: "an error occurred",
    }); 
    })
  
  }
};
exports.validateAdmin = async (req, res, next) => {
  try {
    const { email, adminId } = req.body;
    const admin = await adminDb.findOne({
      where: {
        email: email,
        uid: adminId,
      },
    });
    if (!admin) {
      return res.json({
        code: 404,
        message: "invalidate credentials",
      });
    }
    req.admin = admin;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.validateAdminOnGetRequest = async (req, res, next) => {
  try {
    const { adminId } = req.query;
    const admin = await adminDb.findOne({
      where: {
        uid: adminId,
      },
    });
    if (!admin) {
      return res.json({
        code: 404,
        message: "invalidate credentials",
      });
    }
    req.admin = admin;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
