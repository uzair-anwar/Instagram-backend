const db = require("../connection");

exports.follow = async (req, res, next) => {
  try {
    const { followId } = req.params;
    const userId = req.id;
    const result = await db.followings.findOne({
      where: { userId, followerId: followId },
    });

    if (result) {
      const unfollow = await db.followings.destroy({
        where: { userId, followerId: followId },
      });

      const unfollowing = await db.followers.destroy({
        where: { userId: followId, followingId: userId },
      });

      if (unfollow > 0 && unfollowing > 0) {
        res.send({
          status: 200,
          message: "Unfollow Successfully",
        });
      } else {
        res.send({
          status: 400,
          message: "Can  not Unfollow",
        });
      }
    } else {
      const follow = await db.followings.create({
        userId,
        followerId: followId,
      });
      const follower = await db.followers.create({
        userId: followId,
        followingId: userId,
      });
      if (follow && follower) {
        res.send({
          status: 200,
          message: "follow Successfully",
        });
      } else {
        res.send({
          status: 400,
          message: "Can not follow",
        });
      }
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const userId = req.id;

    const result = await db.followings.findAll({
      where: { userId },
      attributes: { exclude: ["id", "followerId", "createdAt", "updatedAt"] },
      include: {
        model: db.users,
        as: "follower",
        attributes: ["id", "username", "image"],
      },
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
