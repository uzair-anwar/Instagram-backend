const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const db = require("../connection");

exports.create = async (req, res, next) => {
  try {
    const uploader = async (path) =>
      await cloudinary.uploads(path, "insta-clone");

    const tempUrls = [];
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      tempUrls.push(newPath);
      fs.unlinkSync(path);
    }

    const { caption } = req.body;
    const result = await db.posts.create({ caption });
    const { id } = result;

    for (const element of tempUrls) {
      const { url } = element;
      await db.images.create({ url, postId: id });
      urls.push(url);
    }

    res.send({
      status: 201,
      message: "Post successfully created",
      data: { id, urls },
    });
  } catch (error) {
    res.send({
      status: 400,
      message: "Post can not be created",
    });
  }
};
