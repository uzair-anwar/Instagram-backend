const db = require("../connection");

exports.userVerify = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.id;

  const result = await db.posts.findOne({ where: { id, userId } });

  if (result === null) {
    return res.send({
      status: 400,
      message: "Unautherized user",
    });
  } else {
    next();
  }
};
