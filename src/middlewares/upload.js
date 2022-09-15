const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

exports.upload = multer({
  storage: storage,
});
