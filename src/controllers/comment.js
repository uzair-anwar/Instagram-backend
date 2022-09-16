const db = require("../connection");

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const userId = req.id;
    const result = await db.comments.create({ body, postId, userId });

    if (result) {
      res.send({
        status: 201,
        message: "Comment successfully created",
      });
    } else {
      res.send({
        status: 400,
        message: "Comment can not be created",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: "Comment can not be created",
    });
  }
};
exports.getAllComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const result = await db.comments.findAll({ where: { postId } });
    if (result) {
      res.send({
        status: 200,
        result,
      });
    } else {
      res.send({
        status: 400,
        message: "No comment found",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: "Comment can not be get",
    });
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const { id, postId } = req.params;
    const userId = req.id;
    const result = await db.comments.destroy({ where: { id, postId, userId } });
    if (result > 0) {
      res.send({
        status: 200,
        message: "Comment successfully deleted",
      });
    } else {
      res.send({
        status: 400,
        message: "No comment deleted",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: "Comment can not be deleted",
    });
  }
};
