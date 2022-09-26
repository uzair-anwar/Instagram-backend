const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const db = require("./src/connection");

require("dotenv").config();
const port = process.env.SERVER_PORT;

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/story", storyRoutes);

db.sequelize
  .sync({})
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.listen(port, (err) => {
  if (err) {
    return console.log(`Connection not listion on port ${port}`);
  }
  console.log(`Facebook app listening on port ${port}!`);
});
