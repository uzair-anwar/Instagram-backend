const db = require("../connection");
const Op = db.Sequelize.Op;
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const {
  createHashPassword,
  comparePassword,
} = require("../utils/hasdedPassword");
const { createJWT } = require("../utils/createJWT");
const { sendEmail } = require("../utils/sendEmail");

exports.signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    const uploader = async (path) =>
      await cloudinary.uploads(path, "insta-clone");

    const { path } = req.file;
    const image = await uploader(path);
    const { url } = image;
    fs.unlinkSync(path);

    const duplicateUser = await db.users.findOne({
      where: { email },
    });

    if (duplicateUser) {
      res.send({ status: 409, message: "Account already exists" });
    } else {
      let hashedPassword = createHashPassword(password);

      const newUser = await db.users.create({
        name,
        username,
        email,
        password: hashedPassword,
        image: url,
      });

      if (newUser) {
        res.send({
          status: 201,
          message: "Account created Successfully",
        });
      } else {
        res.send({
          status: 400,
          message: "Account can not be created",
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

exports.login = async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await db.users.findOne({
      where: { email },
    });

    if (!result) {
      res.send({
        status: 400,
        message: "Account does not exist",
      });
    } else {
      comparePassword(req.body.password, result.password).then((response) => {
        if (response) {
          let token = createJWT(result);
          res.send({
            status: 200,
            userToken: token,
            result: result,
          });
        } else {
          res.send({
            status: 401,
            accessToken: null,
            message: "Password does not match",
          });
        }
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let id = req.id;
    const { searchedId } = req.params;
    if (searchedId) {
      id = searchedId;
    }

    let user = {
      id: "",
      name: "",
      username: "",
      email: "",
      image: "",
      posts: [],
      followers: "",
      followings: "",
      isPrivate: false,
    };
    const result = await db.users.findOne({
      where: { id },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    user.id = result.id;
    user.name = result.name;
    user.username = result.username;
    user.image = result.image;
    user.email = result.email;
    user.isPrivate = result.isPrivate;

    const follower = await db.followers.findAll({ where: { userId: id } });
    const following = await db.followings.findAll({ where: { userId: id } });

    user.followers = follower.length;
    user.followings = following.length;

    const posts = await db.posts.findAll({
      where: { userId: id },
      include: {
        model: db.images,
        attributes: { exclude: ["id", "postId", "createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
    });

    user.posts = posts;

    if (!result) {
      res.send({
        status: 400,
        message: "Account does not exist",
      });
    } else {
      res.send({
        status: 200,
        result: user,
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.searchUsers = async (req, res, next) => {
  const { name } = req.params;

  try {
    const result = await db.users.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    if (!result) {
      res.send({
        status: 400,
        message: "Account does not exist",
      });
    } else {
      res.send({
        status: 200,
        result: result,
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.id;
    const result = await db.users.update(
      {
        name: req.body.name,
        username: req.body.username,
        isPrivate: req.body.isPrivate,
      },
      { where: { id } }
    );
    if (result) {
      res.send({
        status: 200,
        message: "Account update successfully",
      });
    } else
      res.send({
        status: 401,
        message: "Account can not be update",
      });
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const id = req.id;
    const { oldPassword, newPassword } = req.body;
    const user = await db.users.findOne({ where: { id } });
    comparePassword(oldPassword, user.password).then(async (response) => {
      if (response) {
        let hashedPassword = createHashPassword(oldPassword);
        const result = await db.users.update(
          {
            password: hashedPassword,
          },
          { where: { id } }
        );
        if (result) {
          res.send({
            status: 200,
            message: "Password update successfully",
          });
        } else {
          res.send({
            status: 401,
            message: "Password can not be update",
          });
        }
      } else {
        res.send({
          status: 401,
          message: "Old Password is not matched",
        });
      }
    });
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.sendPasswordEmail = async (req, res, next) => {
  try {
    const emailTo = req.body.email;
    const user = await db.users.findOne({ where: { email: emailTo } });
    if (user) {
      const message = {
        from: `${process.env.Email_From}`,
        to: `${emailTo}`,
        subject: "Forget Password",
        html: `<h1>Hello!</h1><br/>
        <p>Click the link if you want to procced forget password producer</p>
        <a href="${process.env.FRONTEND_URL}/forgetpassword?email=${emailTo}">Link</a>`,
      };
      await sendEmail(message);

      res.send({
        status: 200,
        message: "Email send Successfully, Please check your email",
      });
    } else {
      res.send({
        status: 401,
        message: "No account is register at this email",
      });
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};

exports.addNewPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let hashedPassword = createHashPassword(password);
    const result = await db.users.update(
      {
        password: hashedPassword,
      },
      { where: { email } }
    );
    if (result) {
      res.send({
        status: 200,
        message: "Password update successfully",
      });
    } else {
      res.send({
        status: 401,
        message: "Password can not be update",
      });
    }
  } catch (error) {
    res.send({
      status: 401,
      message: error.message,
    });
  }
};
