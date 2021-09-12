const transactionDb = require("../../models/transaction");
const schoolDb = require("../../models/school");
const departmentDb = require("../../models/department");
const { Op } = require("sequelize");
const chatlistDb = require("../../models/chatlist");
const chatDb = require("../../models/chat");
const sequelize = require("sequelize")
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
    const limit = 10;
    const chatlist = await chatlistDb.findAll({
      order:[["updatedAt","DESC"]],
      limit: limit,
      offset: page * limit,
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
    const { page, group } = req.query;
    const limit = 20;
    const chats = await chatDb.findAll({
      order:[["createdAt","ASC"]],
      where: {
        group: group,
      },
      limit: limit,
      offset: limit * page,
      attributes: { exclude: ["id"] },
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
    const {chatIds,group} = req.body
    const chats = await chatDb.findAll({
      where:{
        sender:"ADMIN",
        group:group,
        chatId:{
          [sequelize.Op.notIn]:chatIds

        },
      },
      attributes:{exclude:["id","createdAt","updatedAt"]}
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
