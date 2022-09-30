const express = require("express");
const { create, getUserMessages } = require("../controllers/chat");
const router = express.Router();

//Middlewares
const { verifyToken } = require("../middlewares/verifyToken");

//Story routes
router.post("/send", verifyToken, create);
router.get("/getMessage/:receiverId", verifyToken, getUserMessages);

module.exports = router;
