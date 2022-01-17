const transactionDb = require("../models/transaction");
const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const lisenseKeyDb = require("../models/lisenseKey");
const utilsDb = require("../models/utils")
const notificationDb = require("../models/notification")
const IO = require("../socket")
exports.confirmTransaction = async (req, res, next) => {
  try {
    const { userEmail, school, faculty, department, level, semester } =
      req.query;
    //get institutions ids
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    //check transaction db for availability
    const transaction = await transactionDb.findOne({
      where:{
      userEmail:userEmail,
      schoolId: institutionIds[0],
      facultyId: institutionIds[1],
      departmentId: institutionIds[2],
      levelId: institutionIds[3],
      semester: semester,
    }
    });
    if (!transaction) {
      return res.status(200).json({
        transactionExists: false,
      });
    }
    res.status(200).json({
      transactionExists: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
exports.createTransaction = async (req, res, next) => {
  try {
    const {
      title,
      userEmail,
      userRef,
      transactionRef,
      amount,
      paymentMethod,
      semester,
      key,
      userTxId,
      school,
      faculty,
      department,
      level,
    } = req.body;
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    if(!institutionIds){
      return res.status(400).json({
        message:"school not found",
        created:false
      })
    }
    const names = await getInstitutionName(school,faculty,department,level)
    
    //create transaction
    const transaction = await transactionDb.create({
      title,
      userEmail,
      userRef,
      transactionRef,
      amount,
      paymentMethod,
      semester,
      userTxId,
      key,
      schoolId: institutionIds[0],
      facultyId: institutionIds[1],
      departmentId: institutionIds[2],
      levelId: institutionIds[3],
    });
    
     //create notification
     const notification = await notificationDb.create({
      subject:"NEW PURCHASE",
      notification:`user with email ${userEmail} has purchased ${names[0]} ${names[3]} ${names[2]}  pastquestions for ${amount!=undefined||amount!=null?amount:0}`
    })
    delete transaction.dataValues["id"]
    delete notification.dataValues["id"]
    IO.getIO().emit("transaction",{...transaction.dataValues,...notification.dataValues})
    res.status(200).json({
      created: true,
      message: "transaction created",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
//method for creating key
exports.createTransactionForKeyOrCardPayment = async (req, res, next) => {
  try {
    const {
      title,
      userEmail,
      userRef,
      transactionRef,
      amount,
      paymentMethod,
      semester,
      key,
      userTxId,
      school,
      faculty,
      department,
      level,
    } = req.body;
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    if(!institutionIds){
      return res.status(400).json({
        message:"school not found",
        created:false
      })
    }
    const names = await getInstitutionName(school,faculty,department,level)
    
    //create transaction
    const newTransaction = await transactionDb.build({
      title,
      userEmail,
      userRef,
      transactionRef,
      amount,
      paymentMethod,
      semester,
      userTxId,
      key,
      schoolId: institutionIds[0],
      facultyId: institutionIds[1],
      departmentId: institutionIds[2],
      levelId: institutionIds[3],
    });
    //update key
    if (paymentMethod == "key") {
      await lisenseKeyDb.update(
        {
          isUsed: true,
          usedBy: userRef,
          user: userEmail,
        },
        {
          where: {
            key: key,
          },
        }
      );
    }

    //save transaction
    await newTransaction.save();
     //create notification
     const notification = await notificationDb.create({
      subject:"NEW PURCHASE",
      notification:`user with email ${userEmail} has purchased ${names[0]} ${names[3]} ${names[2]} pastquestions for ${amount}`
    })
    delete newTransaction.dataValues["id"]
    delete notification.dataValues["id"]
    IO.getIO().emit("transaction",{...newTransaction.dataValues,...notification.dataValues})

    res.status(200).json({
      created: true,
      message: "transaction created",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occured",
    });
  }
};
const getInstitutionName = async(school,faculty,department,level)=>{
  //get school
  const sch = await schoolDb.findOne({
    where: {
      sid: school,
    },
    attribute: ["id","name"],
  });
  //get faculty
  const fac = await facultyDb.findOne({
    where: {
      fid: faculty,
    },
    attribute: ["id","name"],
  });
  //get department
  const dept = await departmentDb.findOne({
    where: {
      did: department,
    },
    attribute: ["id","name"],
  });
  //get level
  const lev = await levelDb.findOne({
    where: {
      lid: level,
    },
    attribute: ["id","level"],
  });
  if (sch && fac && dept && lev) {
    return [sch.name,fac.name,dept.name,lev.level]
  }
}
const getInstitutionIds = async (school, faculty, department, level) => {
  //get school
  const sch = await schoolDb.findOne({
    where: {
      sid: school,
    },
    attribute: ["id","name"],
  });
  //get faculty
  const fac = await facultyDb.findOne({
    where: {
      fid: faculty,
    },
    attribute: ["id","name"],
  });
  //get department
  const dept = await departmentDb.findOne({
    where: {
      did: department,
    },
    attribute: ["id","name"],
  });
  //get level
  const lev = await levelDb.findOne({
    where: {
      lid: level,
    },
    attribute: ["id","name"],
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
exports.getCardPaymentSettings = async(req,res,next)=>{
  try{
    const util = await utilsDb.findOne({
      where:{
        name:"allowCardPayment"
      },
      attributes:["value"]
    })
    return res.status(200).json({
      value:util.dataValues.value
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}