const { Op } = require("sequelize");
const db = require("../connection");

exports.create = async (req, res, next) => {
  try {
    const { text, receiverId } = req.body;
    const userId = req.id;
    const result = await db.chats.create({
      text,
      userId,
      receiverId,
    });

    if (result) {
      res.send({
        status: 201,
        result,
        message: "Message send Successfully",
      });
    } else {
      res.send({
        status: 400,
        message: "Message can not be sent",
      });
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.getUserMessages = async (req, res, next) => {
  try {
    const userId = req.id;
    const { receiverId } = req.params;

    const result = await db.chats.findAll({
      where: {
        userId: { [Op.or]: [userId, receiverId] },
        receiverId: { [Op.or]: [userId, receiverId] },
      },
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.users,
          as: "user",
        },
        {
          model: db.users,
          as: "receiver",
        },
      ],
    });

    if (result)
      res.send({
        status: 200,
        result,
      });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};
