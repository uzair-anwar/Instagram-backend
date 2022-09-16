const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const {
  create,
  deletePost,
  getAllPosts,
  editPost,
  doLike,
  getAllLikes,
} = require("../controllers/post");
const { verifyToken } = require("../middlewares/verifyToken");
const { userVerify } = require("../middlewares/userVerify");

router.post("/create", upload.array("images"), verifyToken, create);
router.get("/allPosts", verifyToken, getAllPosts);
router.delete("/:id", [verifyToken, userVerify], deletePost);
router.put("/edit/:id", [verifyToken, userVerify], editPost);

router.get("/:postId/like", verifyToken, doLike);
router.get("/likes", verifyToken, getAllLikes);

module.exports = router;
