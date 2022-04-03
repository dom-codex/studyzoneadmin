const keysDb = require("../models/lisenseKey");
const _generateOtp = ()=>{
const digits = "0123456789";
let otp = "";
for(let i = 0; i < 6; i++){
    otp+= digits[Math.floor(Math.random()*10)];
}
return otp;
}
exports.generateOtp = async()=>{
    let continueLooping = true;
    let otp = ""
    while(continueLooping){
        otp = _generateOtp();
        const alreadyExists = await keysDb.findOne({
            where:{
                key:otp
            }
        })
        if(alreadyExists==null){
            break;
        }
    }
    return otp;
}
