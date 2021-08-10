const validateSchool = require("../utility/validateFullSchool");
const transactionDb = require("../models/transaction");
const keysDb = require("../models/lisenseKey");
const { Op } = require("sequelize");
exports.createTransaction = async (req, res, next) => {
  try {
    const {
      uid,
      amount,
      trf,
      title,
      email,
      time,
      semester,
      paymentMethod,
      userTxId,
      key,
    } = req.body;
    const result = await validateSchool(req);
    if (!result.isValid) {
      return res.status(400).json({
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
