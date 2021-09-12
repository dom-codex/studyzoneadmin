const axios = require("axios");
const transactionDb = require("../../models/transaction");
const withDrawalRequest = require("../../models/withDrawalRequest");
const activityDetails = require("../../module/activityDetails");
const utilsDb = require("../../models/utils")
exports.fetchStatistics = async (req, res, next) => {
  try {
    const result = await axios.get(`http://127.0.0.1:4000/get/users/number`);
    const transactions = await transactionDb.sum("amount");
    const requests = await withDrawalRequest.count({
      where: {
        attendedTo: false,
      },
    });
    res.status(200).json({
      code: 200,
      message: "success",
      users: result.data.nUsers,
      transactions: transactions,
      requests: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.fetchDetails = async (req, res, next) => {
  try {
    const transactions = await activityDetails.fetchAllTransactions(req);
    const lisensekeys = await activityDetails.fetchAllKeys(req);
    const unUsedKeys = await activityDetails.fetchUnUsedKeys(req);
    const usedKeys = await activityDetails.fetchUsedKeys(req);
    res.status(200).json({
      code: 200,
      message: "success",
      transactions: transactions,
      allKeys: lisensekeys,
      notUsedKeys: unUsedKeys,
      usedKeys: usedKeys,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
//ADD ROUTE PROTECTION
exports.checkForFreeTrialStatus = async(req,res,next)=>{
  try{
    const utils = await utilsDb.findOne({
      where:{
        name:"freeTrialAvailable"
      },
      attributes:["name","value"]
    })
    return res.status(200).json({
      value:utils.dataValues.value,
      code:200
    })
  }catch(e){
    console.log(e)
    res.status(500).end()
  }
}
