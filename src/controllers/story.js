const db = require("../connection");
const Op = db.Sequelize.Op;
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const Queue = require("bull");
const storyQueue = new Queue("story");

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
      storyQueue.add(
        "story",
        {
          input: await db.stories.destroy({
            where: { id: newStory.id },
          }),
        },
        {
          delay: 60 * 60,
        }
      );
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

exports.getSelfStories = async (req, res, next) => {
  try {
    const userId = req.id;

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

exports.deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.stories.destroy({
      where: { id },
    });

    if (result > 0)
      res.send({
        status: 200,
        message: "Story deleted successfully",
      });
    else {
      res.send({
        status: 401,
        message: "Story can not be deleted",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};
