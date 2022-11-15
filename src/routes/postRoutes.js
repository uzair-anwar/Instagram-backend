const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const {
  create,
  deletePost,
  getAllPosts,
  editPost,
  doLike,
} = require("../controllers/post");
const {
  createComment,
  getAllComments,
  deleteComment,
  editComment,
} = require("../controllers/comment");
const { verifyToken } = require("../middlewares/verifyToken");
const { userVerify } = require("../middlewares/userVerify");
const { authenticateUser } = require("../middlewares/authenticateUser");

//Post routes
router.post("/create", upload.array("images"), verifyToken, create);
router.get("/allPosts", verifyToken, getAllPosts);
router.delete("/:id", [verifyToken, userVerify], deletePost);
router.put("/edit/:id", [verifyToken, userVerify], editPost);

//Like routes
router.get("/:postId/like", verifyToken, doLike);

//Comment routes
router.post("/:postId/createComment", verifyToken, createComment);
router.get("/:postId/comments", verifyToken, getAllComments);
router.delete(
  "/:postId/:id/delete",
  [verifyToken, authenticateUser],
  deleteComment
);
router.put("/:postId/:id/edit", [verifyToken, authenticateUser], editComment);

module.exports = router;
