const announcementDb = require("../../models/announcement")
const {limit} = require("../../utility/constants")
exports.getAnnouncements = async(req,res,next)=>{
  try{
    const {page} = req.query
    const announcements = await announcementDb.findAll({
      /*limit:limit,
      offset:limit*page,*/
      attributes:{exclude:["id","updatedAt"]}
    })
    return res.status(200).json({
      code:200,
      announcements:announcements
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      code:500,
      announcements:[],
      message:"an error occurred"
    })
  }
}
