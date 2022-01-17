const utilsDb = require("../models/utils");
const axios = require("axios")
exports.upDateSettings = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(400).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { value, name, utilsId } = req.body;
    await utilsDb.update(
      { value: value },
      {
        where: {
          name: name,
          utilsId: utilsId,
        },
      }
    );
    //SEND NOTIFICATION
    if(name =="allowCardPayment"||name=="minWithdrawal"||name=="freeTrialAvailable"){
      const uri = `${process.env.userBase}/notifications/realtime/update`
      try{
        await axios.post(uri,{
          name:name,
          value:value
        })
        
      }catch(e){console.log(e)}
    }
    res.status(200).json({
      code: 200,
      message: "updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getSettings = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const settings = await utilsDb.findAll({
      attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    });
    res.status(200).json({
      code: 200,
      settings: settings,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getSetting = async(req,res,next)=>{
  try{
    const {name} = req.query
    const setting = await utilsDb.findOne({
      where:{
        name:name
      },
      attributes:{exclude:["id","created","updatedAt"]}
    })
    return res.status(200).json({
      setting:setting.dataValues
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}