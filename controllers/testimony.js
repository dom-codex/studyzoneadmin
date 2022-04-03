const testimonyDb = require("../models/testimony");
const {Dropbox} = require("dropbox")
exports.getVideoLink = async(req,res,next)=>{
  try{
const{url} = req.query
const dropbox = new Dropbox({accessToken:process.env.dropboxToken})
//const {result} = await dropbox.filesGetMetadata({path:`/testimony/${url}`})
//console.log(result1)
 //console.log(result)
const  {result:{links}}= await dropbox.sharingListSharedLinks({path:`/testimony/${url}`,direct_only:false})
console.log(links)
const newLink = links[0].url //.replace("www.dropbox.com","dl.dropboxusercontent.com")
const resp = await dropbox.filesDownload({path:`/testimony/${url}`})
res.status(200).write(resp.result.fileBinary,"binary")
res.end(null,"binary")
return
return res.status(200).json({
  link:newLink,
  message:"retrieved"
})
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}
exports.checkForTestimony = async (req, res, next) => {
  try {
    const { user } = req.query;
    const testimony = await testimonyDb.findOne({
      where: {
        user: user,
      },
      attributes: ["user"],
    });
    if (!testimony) {
      return res.json({
        code: 404,
        message: "testimony not found",
      });
    }
    res.json({
      code: 200,
      message: "testimony found",
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
exports.addUserTestimony = async (req, res, next) => {
  try {
    const { user, link, fileId, email, name } = req.body;
    const testimony = await testimonyDb.create({
      user: user,
      videoLink: link,
      videoId: fileId,
    });
    //send notification to admin
    res.status(200).json({
      code: 200,
      message: "testimony added",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
