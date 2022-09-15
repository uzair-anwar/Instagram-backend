const { body, validationResult } = require("express-validator");

exports.signupValidation = [
  body("name")
    .exists()
    .withMessage("Name can not be empty")
    .isLength({ max: 25 })
    .withMessage("the name must have maximum length of 25")
    .matches(/^[aA-zZ\s]+$/)
    .withMessage("Only alphabets are allowed for name ")
    .trim(),

  body("username")
    .exists()
    .withMessage("User Name can not be empty")
    .isLength({ max: 10 })
    .withMessage("the name must have maximum length of 10")
    .matches(/^[aA-zZ\s]+$/)
    .withMessage("Only alphabets are allowed for name ")
    .trim(),

  body("email")
    .exists()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("Invalid email address")
    .trim(),

  body("password")
    .exists()
    .withMessage("Password can not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must have minimum 6 character")
    .trim(),

  function (req, res, next) {
    let errorValidation = validationResult(req);
    if (errorValidation.array().length > 0) {
      res.send({
        status: 400,
        error: errorValidation.array(),
      });
    } else {
      next();
    }
  },
];

exports.loginValidation = [
  body("email")
    .exists()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("Invalid email address")
    .trim(),

  body("password")
    .exists()
    .withMessage("Password can not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must have minimum 6 character")
    .trim(),

  function (req, res, next) {
    let errorValidation = validationResult(req);
    if (errorValidation.array().length > 0) {
      return res.status(400).json({
        title: "An error occured",
        error: errorValidation.array(),
      });
    }
    next();
  },
];
