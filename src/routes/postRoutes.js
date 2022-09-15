const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const { create } = require("../controllers/post");

router.post("/create", upload.array("images"), create);

module.exports = router;
