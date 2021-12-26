const adminDb = require("../models/admin");
const bcrypt = require("bcrypt");
const nanoid = require("nanoid").nanoid;
exports.createAdmin = async (req, res, next) => {
  try {
    const canCreateAdmin = req.canCreateAdmin;
    if (!canCreateAdmin) {
      return res.status(400).json({
        code: 400,
        message: "cannot create admin account",
      });
    }
    const { email, name, role, password } = req.body;
    //hash password
    const hashedP = await bcrypt.hash(password, 12);
    const code = nanoid(6);
    const admin = await adminDb.create({
      email: email,
      password: hashedP,
      name: name,
      role: role,
      verificationCode: code,
    });
    //send email with code
    res.status(200).json({
      code: 200,
      message: "admin created successfully",
      data: {
        uid: admin.uid,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (e) {
    res.status(400).json({
      code: 400,
      message: "an error occurred",
    });
  }
};
exports.login = async (req, res, next) => {
  const canLogin = req.canLogin;
  if (!canLogin) {
    return res.status(400).json({
      message: "cannot log in",
    });
  }
  const admin = req.admin;
  admin.loggedIn = true;
  res.status(200).json({
    code: 200,
    email: admin.email,
    role: admin.role,
    adminId: admin.uid,
    loggedIn: admin.loggedIn,
    message: "logged in",
  });
};
exports.verifyAccount = async (req, res, next) => {
  const canVerify = req.canVerify;
  if (!canVerify) {
    return res.status(400).json({
      code: 400,
      message: "invalid email or verfication code",
    });
  }
  const admin = req.admin;
  admin.isVerified = true;
  admin.loggedIn = true;
  await admin.save();
  res.status(200).json({
    code: 200,
    message: "verified",
  });
};
exports.verifyAdmin = async(req,res,next)=>{
  try{
    const {adminId} = req.query
    const admin = await adminDb.findOne({
      where:{
        uid:adminId
      },
      attributes:["id"]
    })
    if(!admin){
      return res.status(404).json({
        message:"admin not found"
      })
    }
    res.status(200).json({
      message:"successs"
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occured"
    })
  }
}