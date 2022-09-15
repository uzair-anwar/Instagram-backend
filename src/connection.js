const Sequelize = require("sequelize");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "config", "config.js"))[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,
    logging: false,
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./models/user.model.js")(sequelize, Sequelize);
db.posts = require("./models/post.model.js")(sequelize, Sequelize);
db.images = require("../../Extra/image.model.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, { foreignkey: "userId" });
db.posts.belongsTo(db.users, { foreignkey: "userId" });

db.posts.hasMany(db.images, { foreignkey: "postId" });
db.images.belongsTo(db.posts, { foreignkey: "postId" });

module.exports = db;
