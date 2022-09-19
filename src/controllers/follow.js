const db = require("../connection");

exports.follow = async (req, res, next) => {
  const { followUserId } = req.params;
  const userId = req.id;
  const result = await db.followings.findOne({
    where: { userId, followerUserId: followUserId },
  });

  if (result) {
    const unfollow = await db.followings.destroy({
      where: { userId, followerUserId: followUserId },
    });

    const unfollowing = await db.followers.destroy({
      where: { userId: followUserId, followingUserId: userId },
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
      followerUserId: followUserId,
    });
    const follower = await db.followers.create({
      userId: followUserId,
      followingUserId: userId,
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
};
