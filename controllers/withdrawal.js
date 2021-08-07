exports.processWithDrawal = async (req, res, next) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
