const nodemailer = require("nodemailer");
require("dotenv").config();

transport = nodemailer.createTransport({
  host: `${process.env.Email_Host}`,
  port: `${process.env.Email_Port}`,
  auth: {
    user: `${process.env.Email_User}`,
    pass: `${process.env.Email_Pass}`,
  },
});

exports.sendEmail = async (message) => {
  const result = await transport.sendMail(message, function (err, info) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};
