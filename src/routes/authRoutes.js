const express = require("express");
const { login, signup, getUser } = require("../controllers/account");
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/authValidations");
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.get("/getUser", verifyToken, getUser);

module.exports = router;
