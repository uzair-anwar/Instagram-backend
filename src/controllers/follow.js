const db = require("../connection");
const { update } = require("./account");

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

exports.getFollowStatus = async (req, res, next) => {
  try {
    const userId = req.id;
    const { searchedId } = req.params;

    const result = await db.followings.findOne({
      where: { userId, followerId: searchedId },
    });
    if (result)
      res.send({
        status: 201,
        message: "Already Followed",
      });
    else {
      res.send({
        status: 202,
        message: "You did not follow her",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    const { requesterId } = req.params;
    const userId = req.id;

    const result = await db.requests.findOne({
      where: { userId: requesterId, requesterId: userId },
    });

    if (result) {
      const unRequest = await db.requests.destroy({
        where: { userId: requesterId, requesterId: userId },
      });

      if (unRequest > 0) {
        res.send({
          status: 200,
          message: "Request is deleted Successfully",
        });
      } else {
        res.send({
          status: 400,
          message: "Request can not be deleted",
        });
      }
    } else {
      const requested = await db.requests.create({
        userId: requesterId,
        requesterId: userId,
      });
      if (requested) {
        res.send({
          status: 200,
          message: "Requested Successfully",
        });
      } else {
        res.send({
          status: 400,
          message: "Can not requested",
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

exports.getRequests = async (req, res, next) => {
  try {
    const userId = req.id;

    const result = await db.requests.findAll({
      where: { userId },
      attributes: { exclude: ["updatedAt"] },
      include: {
        model: db.users,
        as: "requester",
        attributes: {
          exclude: [
            "id",
            "username",
            "email",
            "password",
            "isPrivate",
            "createdAt",
            "updatedAt",
            "userId",
          ],
        },
      },
    });
    if (result)
      res.send({
        status: 201,
        result,
      });
    else {
      res.send({
        status: 204,
        message: "There is no request",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.requests.destroy({
      where: { id },
    });
    if (result > 0)
      res.send({
        status: 201,
        message: "Request Rejected",
      });
    else {
      res.send({
        status: 202,
        message: "Request can not be rejected",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    const follow = await db.followings.create({
      userId: id,
      followerId: userId,
    });
    const follower = await db.followers.create({
      userId,
      followingId: id,
    });
    if (follow && follower) {
      const result = await db.requests.destroy({
        where: { userId, requesterId: id },
      });
      if (result)
        res.send({
          status: 200,
          message: "Request accepted",
        });
    } else {
      res.send({
        status: 400,
        message: "Request can not be accpted",
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};
