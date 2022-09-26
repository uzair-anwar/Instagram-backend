const express = require("express");
const {
  login,
  signup,
  update,
  getUser,
  searchUsers,
  updatePassword,
  sendPasswordEmail,
  addNewPassword,
} = require("../controllers/account");
const {
  follow,
  getFollowing,
  getFollowStatus,
  sendRequest,
  getRequests,
  rejectRequest,
  acceptRequest,
} = require("../controllers/follow");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/verifyToken");
const {
  loginValidation,
  signupValidation,
} = require("../middlewares/authValidations");

router.post("/login", loginValidation, login);
router.post("/signup", upload.single("image"), signupValidation, signup);
router.put("/update", verifyToken, update);
router.put("/updatePassword", verifyToken, updatePassword);
router.post("/sendEmail", sendPasswordEmail);
router.post("/addPassword", addNewPassword);
router.get("/getUser", verifyToken, getUser);
router.get("/getRequests", verifyToken, getRequests);
router.get("/getFollow", verifyToken, getFollowing);
router.get("/getFollowStatus/:searchedId", verifyToken, getFollowStatus);
router.get("/search/:searchedId", verifyToken, getUser);
router.get("/request/:requesterId", verifyToken, sendRequest);
router.delete("/rejectRequest/:id", verifyToken, rejectRequest);
router.get("/acceptRequest/:id", verifyToken, acceptRequest);

//Follow module routes
router.get("/follow/:followId", verifyToken, follow);
router.get("/:name", verifyToken, searchUsers);

module.exports = router;
