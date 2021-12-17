const axios = require("axios");
const withDrawalRequestDb = require("../models/withDrawalRequest");
const testimonyDb = require("../models/testimony")
const utilityDb = require("../models/utils")
exports.comfirmWithdrawalStatus = async(req,res,next)=>{
  try{
    //get user details
    const {user} = req.query
    //get check if user has already a testimony
    const testimony = await testimonyDb.findOne({
      where:{
        user:user
      },
      attributes:[
        "id"
      ]
    })
    if(testimony){
      return res.status(200).json({
        canProceed:true
      })
    }
    // if not retrieve no of withdrawals before testimony upload is enforced
    const utility = await utilityDb.findOne({
      where:{
        name:"numberOfWithdrawalBeforeTestimonyEnforcement"
      },
      attributes:["value"]
    })
    //get the counts of withdrawals performed by user which have being processed
    const withdrawals = await withDrawalRequestDb.findAndCountAll({
      where:{
        requestedBy:user,
        attendedTo:true,
        status:"COMFRIMED"
      }
    })
    //compare and act accordingly
    if(utility.value.toString() > withdrawals.count.toString()){
      return res.status(200).json({
        canProceed:true
      })
    }
    //tell user to upload testimony
    return res.status(200).json({
      canProceed:false
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred!!!"
    })
  }
}
exports.processWithDrawal = async (req, res, next) => {
  try {
    const { userName, uid, userEmail, canProceed } = req;
    if (!canProceed) {
      return res.json({
        code: 400,
        message: "an error occurred, try again",
      });
    }
    const { amount,bank,accountNo,accountName,bankCode } = req.body;
    //notify admin of withdrawal request
    const newRequest = await withDrawalRequestDb.create({
      amount: amount,
      requestedBy: uid,
      requesteeName: userName,
      requesteeEmail: userEmail,
      BankName:bank,
      BankAccountName:accountName,
      BankAccountNo:accountNo,
      BankCode:bankCode

    });
    //send notification to admin
    res.status(200).json({
      code: "200",
      message: "request placed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.processWithDrawalRequestStatus = async (req, res, next) => {
  try {
    //continue by updating the payment status
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { status, withdrawalHash } = req.body;
    //send request to restore user amount
    const record = await withDrawalRequestDb.findOne({
      where: {
        wid: withdrawalHash,
      },
      attribute: ["requestedBy", "requesteeEmail", "amount"],
    });
    if (status === "DECLINED") {
      const uri = `${process.env.userBase}/withdrawal/reverse`;
      const feedBack = await axios.post(uri, {
        amount: record.amount,
        email: record.requesteeEmail,
        userId: record.requestedBy,
      });
      const updated = await withDrawalRequestDb.update(
        {
          status: status,
        },
        {
          where: {
            wid: withdrawalHash,
          },
        }
      );
      return res.status(200).json({
        code: 200,
        message: "updated",
        withdrawalId: withdrawalHash,
        status: status,
      });
    }
    const updated = await withDrawalRequestDb.update(
      {
        status: status,
      },
      {
        where: {
          wid: withdrawalHash,
        },
      }
    );
    //send approval
    const uri = `${process.env.userBase}/notifications/post`;
    await axios.post(uri, {
      user: record.requestedBy,
      subject: "Withdrawal Approved",
      message:
        " Your withdrawal request has been approved and is being processed",
    });
    return res.status(200).json({
      code: 200,
      message: "updated",
      withdrawalId: withdrawalHash,
      status: status,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
