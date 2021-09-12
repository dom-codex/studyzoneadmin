const axios = require("axios");
exports.fetchUsers = async (req, res, next) => {
  try {
    const { canProceed, admin } = req;
    const { category, page } = req.query;
    if (!canProceed) {
      return res.json({
        code: 400,
        message: "invalid credentials",
      });
    }
    const url = `${process.env.userBase}/get/users?page=${page}&category=${category}`;
    const result = await axios.get(url);
    const data = result.data;

    return res.status(200).json({
      users: data.compiled,
      code: 200,
      message: "success",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
