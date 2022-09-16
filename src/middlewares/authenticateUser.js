const db = require("../connection");

exports.authenticateUser = async (req, res, next) => {
  const { postId, id } = req.params;
  const userId = req.id;
  const result = await db.comments.findOne({ where: { id, postId, userId } });
  if (result === null) {
    return res.send({
      status: 400,
      message: "Unautherized user",
    });
  } else {
    next();
  }
};
