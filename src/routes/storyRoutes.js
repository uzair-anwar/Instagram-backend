const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const {
  create,
  getAllStories,
  getSelfStories,
  deleteStory,
} = require("../controllers/story");

//Middlewares
const { verifyToken } = require("../middlewares/verifyToken");

//Story routes
router.post("/create", upload.single("image"), verifyToken, create);
router.get("/getStories", verifyToken, getSelfStories);
router.delete("/delete/:id", verifyToken, deleteStory);
router.get("/:userId", verifyToken, getAllStories);

module.exports = router;
