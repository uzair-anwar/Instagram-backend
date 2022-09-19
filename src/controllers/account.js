const db = require("../connection");
const Op = db.Sequelize.Op;
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const {
  createHashPassword,
  comparePassword,
} = require("../utils/hasdedPassword");
const { createJWT } = require("../utils/createJWT");

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
  const id = req.id;

  try {
    const result = await db.users.findOne({
      where: { id },
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
