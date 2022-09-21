const express = require("express");
const {
  login,
  signup,
  getUser,
  searchUsers,
} = require("../controllers/account");
const { follow, getFollowing } = require("../controllers/follow");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/authValidations");

router.get("/getFollow", verifyToken, getFollowing);
router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.get("/getUser", verifyToken, getUser);
router.get("/:name", verifyToken, searchUsers);

//Follow module routes
router.get("/follow/:followId", verifyToken, follow);

module.exports = router;
