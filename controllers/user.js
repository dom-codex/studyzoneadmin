const axios = require("axios");
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { block, user } = req.body;
    const uri = `${process.env.userBase}/auth/user/status/toggle`;
    const { data } = await axios.post(uri, {
      user,
      block,
    });
    if (data.code != 200) {
      return res.status(401).json({
        code: 201,
        message: "operation failed",
      });
    }
    return res.status(200).json({
      code: 200,
      message: "operation successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getUserDetails = async(req,res,next)=>{
  try{
    const {user} = req.query
    const {data} = await axios(`${process.env.userBase}/get/user/info?userId=${user}`)
    console.log(data)
    res.status(data.code).json({
      message:data.code==404?"user not found":"success",
      ...data.user,
      earnings:data.totalEarned.totalEarned
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}