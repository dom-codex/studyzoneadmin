const utilityDb = require("../models/utils")
exports.getReferralBonus = async(req,res,next)=>{
    try{
        //get value of referral bonus
        const bonus = await utilityDb.findOne({
            where:{
                name:"referralBonus"
            },
            attributes:["value"]
        })
        res.status(200).json({
            bonus:bonus.dataValues.value
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"an error occurred"
        })
    }
}