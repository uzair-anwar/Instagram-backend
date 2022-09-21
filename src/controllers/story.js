const db = require("../connection");
const Op = db.Sequelize.Op;
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.create = async (req, res, next) => {
  try {
    const uploader = async (path) =>
      await cloudinary.uploads(path, "insta-clone");

    const { path } = req.file;
    const image = await uploader(path);
    const { url } = image;
    fs.unlinkSync(path);
    const userId = req.id;

    const newStory = await db.stories.create({
      url,
      userId,
    });

    if (newStory) {
      res.send({
        status: 201,
        message: "Story created Successfully",
      });
    } else {
      res.send({
        status: 400,
        message: "Story can not be created",
      });
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.getAllStories = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await db.stories.findAll({
      where: { userId },
      attributes: { exclude: ["updatedAt"] },
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
