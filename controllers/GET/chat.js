const transactionDb = require("../../models/transaction");
const schoolDb = require("../../models/school");
const departmentDb = require("../../models/department");
const { Op } = require("sequelize");
const chatlistDb = require("../../models/chatlist");
const chatDb = require("../../models/chat");
const sequelize = require("sequelize");
const { limit } = require("../../utility/constants");

exports.getGroupChatDetails = async (req, res) => {
  try {
    //get user from req
    const { department, user } = req.query;
    //find department
    const dept = await departmentDb.findOne({
      where: {
        did: department,
      },
      attributes: ["did", "id", "name"],
    });
    if (!dept) {
      return res.status(404).json({
        code: 404,
        message: "department not found",
      });
    }
    //check if user has paid made purchase in that department
    const hasTransaction = await transactionDb.findOne({
      where: {
        [Op.and]: [{ departmentId: dept.id }, { userRef: user }],
      },
      include: {
        model: schoolDb,
        attributes: ["name"],
      },
      attributes: ["title"],
    });
    if (!hasTransaction) {
      return res.status(404).json({
        code: 404,
        message: "you haven't made any purchase in this department",
      });
    }
    if (!hasTransaction.school) {
      return res.status(404).json({
        code: 404,
        message: "school no longer exists",
      });
    }
    //fetch details
    //send response
    res.status(200).json({
      code: 200,
      school: hasTransaction.school.name,
      department: dept.name,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getChatList = async (req, res) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { page } = req.query;
    const chatlist = await chatlistDb.findAll({
      order:[["updatedAt","DESC"]],
      limit: limit,
      offset: (page-1) * limit,
      attributes: { exclude: ["id"] },
    });
    return res.status(200).json({
      code: 200,
      message: "retrieved",
      chatlist: chatlist,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getChats = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin does not exist",
      });
    }
    const { page, group,firstLoad,lastTime } = req.query;
    const chats = firstLoad == "true"? await chatDb.findAll({
      order:[["id","DESC"]],  
      limit: limit,
      where: {
        group: group,
      },
      //offset: limit * page,
    }): await chatDb.findAll({
      order:[["id","DESC"]],
      limit:limit,
      where:{
      group:group,
      timeSent:{
        [sequelize.Op.lt]: parseInt(lastTime)
      }
    }
    });
  
    return res.status(200).json({
      code: 200,
      message: "retrieved",
      chats: chats,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getOfflineChats = async(req,res,next)=>{
  try{
    const {timeSent,group,firstLoad} = req.body
    const chats = firstLoad? await chatDb.findAll({
      where:{
        sender:"ADMIN",
        group:group,
        timeSent:{
          [sequelize.Op.gt]:timeSent
        },
      },
      attributes:{exclude:["id","createdAt","updatedAt"]}
    }) : await chatDb.findAll({
      limit:limit,
      where:{
        sender:"ADMIN",
        group:group,
        timeSent:{
          [sequelize.Op.lt]:timeSent
        }
      }
    })
    return res.status(200).json({
      code:200,
      chats:chats
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      code:500,
      message:"an error occured"
    })
  }
}
