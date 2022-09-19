const express = require("express");
const {
  login,
  signup,
  getUser,
  searchUsers,
} = require("../controllers/account");
const { follow } = require("../controllers/follow");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/authValidations");

router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.get("/getUser", verifyToken, getUser);
router.get("/:name", verifyToken, searchUsers);

//Follow module routes
router.get("/follow/:followUserId", verifyToken, follow);

module.exports = router;
