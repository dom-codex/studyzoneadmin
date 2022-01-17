const validateSchool = require("../utility/validateFullSchool");
const transactionDb = require("../models/transaction");
const pricingDb = require("../models/pricing");
const notificationDb = require("../models/notification")
const sequelize = require("sequelize");
const IO = require("../socket")
exports.createTransaction = async (req, res, next) => {
  try {
    const {
      uid,
      amount,
      trf,
      title,
      email,
      semester,
      paymentMethod,
      userTxId,
      key,
    } = req.body;
    const result = await validateSchool(req);
    if (!result.isValid) {
      return res.json({
        code: 400,
        message: result.message,
      });
    }
    const { school, faculty, department, level } = result;
    //add time later
    const transaction = await transactionDb.create({
      title: title,
      semester: semester,
      userRef: uid,
      transactionRef: trf,
      userEmail: email,
      amount: amount,
      paymentMethod: paymentMethod,
      schoolId: school.id,
      facultyId: faculty.id,
      departmentId: department.id,
      levelId: level.id,
      userTxId: userTxId,
      key: key,
    });
    //update sales
    await pricingDb.update(
      { price: sequelize.literal("sales + 1") },
      {
        where: {
          [sequelize.Op.and]: [
            { schoolId: school.id },
            { facultyId: faculty.id },
            { departmentId: department.id },
            { levelId: level.id },
            { semester: semester },
          ],
        },
      }
    );
    //create notification
    const notification = await notificationDb.create({
      subject:"NEW PURCHASE",
      notification:`user with email ${email} has purchased ${level.name} ${department.name} ${school.name} pastquestions for ${amount}`
    })
    delete transaction.dataValues["id"]
    delete notification.dataValues["id"]
    IO.getIO().emit("transaction",{...transaction.dataValues,...notification.dataValues})
    res.status(200).json({
      code: 200,
      message: "transaction created",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { txId } = req.body;
    await transactionDb.delete({
      where: {
        userTxId: txId,
      },
    });
    return res.status(200).json({
      code: 200,
      message: "deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
