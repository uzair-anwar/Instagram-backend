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
    const userId = req.id;
    const result = await db.posts.create({ caption, userId });
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

exports.getAllPosts = async (req, res, next) => {
  try {
    //need
    const posts = await db.posts.findAll();

    const result = [];

    for (const post of posts) {
      const urls = [];
      const data = await db.images.findAll({ where: { postId: post.id } });
      const user = await db.users.findOne({ where: { id: post.userId } });
      for (let { url } of data) {
        urls.push(url);
      }
      const dummy = {
        id: post.id,
        name: user.name,
        caption: post.caption,
        date: post.createdAt,
        userPic: user.image,
        url: urls,
      };
      result.push(dummy);
    }
    if (posts.length > 0) {
      res.send({
        status: 200,
        result: result,
      });
    } else {
      res.send({
        status: 204,
        message: "No post exists",
      });
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPostsImages = await db.images.destroy({
      where: {
        postId: id,
      },
    });
    if (deletedPostsImages > 0) {
      const deletedPostsCaption = await db.posts.destroy({
        where: {
          id,
        },
      });
      if (deletedPostsCaption > 0) {
        res.send({
          status: 200,
          message: "Post successfully deleted",
        });
      }
    } else {
      res.send({
        status: 400,
        message: "You can not delete this post",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const { id } = req.params;
    const [updatedPost] = await db.posts.update({ caption }, { where: { id } });

    if (updatedPost > 0) {
      res.send({
        status: 200,
        message: "Post updated successfully",
      });
    } else {
      res.send({
        status: 400,
        message: "you can not update this Post",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: "Post can not be updated",
    });
  }
};

exports.doLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.id;
    const checkLike = await db.likes.findOne({ where: { postId, userId } });
    if (checkLike) {
      const unlike = await db.likes.destroy({ where: { postId, userId } });
      if (unlike > 0) {
        res.send({
          status: 202,
          message: "Post sucessfully Unliked",
        });
      } else {
        res.send({
          status: 400,
          message: "You can not unlike this post",
        });
      }
    } else {
      const like = db.likes.create({ postId, userId });
      if (like) {
        res.send({
          status: 201,
          message: "Post sucessfully liked",
        });
      } else {
        res.send({
          status: 400,
          message: "You can not like this post",
        });
      }
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.getAllLikes = async (req, res, next) => {
  try {
    const result = await db.likes.findAll({
      attributes: [
        "postId",
        [db.sequelize.fn("count", db.sequelize.col("postId")), "likeCount"],
      ],
      group: ["postId"],
    });
    res.send({
      status: 200,
      result: result,
    });
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};
