const express = require("express");
const { login, signup, getUser } = require("../controllers/account");
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/authVerfication");
const {
  loginValidation,
  signupValidation,
  fileValidation,
} = require("../middlewares/authValidations");
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.get("/getUser", verifyToken, getUser);

module.exports = router;
