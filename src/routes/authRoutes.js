const express = require("express");
const { login, signup, getUser } = require("../controllers/account");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/authVerfication");
const {
  loginValidation,
  signupValidation,
  fileValidation,
} = require("../middlewares/authValidations");
router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.get("/getUser", verifyToken, getUser);

module.exports = router;
