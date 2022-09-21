const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { create, getAllStories } = require("../controllers/story");

//Middlewares
const { verifyToken } = require("../middlewares/verifyToken");

//Story routes
router.post("/create", upload.single("image"), verifyToken, create);
router.get("/:userId", verifyToken, getAllStories);

module.exports = router;
