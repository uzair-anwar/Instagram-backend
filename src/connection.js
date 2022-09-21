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
db.images = require("./models/image.model.js")(sequelize, Sequelize);
db.likes = require("./models/likes.model.js")(sequelize, Sequelize);
db.comments = require("./models/comment.model.js")(sequelize, Sequelize);
db.followers = require("./models/follower.model.js")(sequelize, Sequelize);
db.followings = require("./models/following.model.js")(sequelize, Sequelize);
db.stories = require("./models/story.model.js")(sequelize, Sequelize);

//User and post relation
db.users.hasMany(db.posts, { foreignkey: "userId" });
db.posts.belongsTo(db.users, { foreignkey: "userId" });

//Post and image relation
db.posts.hasMany(db.images, { foreignkey: "postId" });
db.images.belongsTo(db.posts, { foreignkey: "postId" });

//User and likes relation
db.users.hasOne(db.likes, { foreignkey: "userId" });
db.likes.belongsTo(db.users, { foreignkey: "userId" });

//Post and likes relation
db.posts.hasMany(db.likes, { foreignkey: "postId" });
db.likes.belongsTo(db.posts, { foreignkey: "postId" });

// User and comments relation
db.users.hasMany(db.comments, { foreignkey: "userId" });
db.comments.belongsTo(db.users, { foreignkey: "userId" });

//Post and comments relation
db.posts.hasMany(db.comments, { foreignkey: "postId" });
db.comments.belongsTo(db.posts, { foreignkey: "postId" });

//User and follower realtion
db.users.hasMany(db.followers, { foreignkey: "userId" });
db.followers.belongsTo(db.users, {
  as: "following",
  foreignkey: "followingId",
});

//User and followering realtion
db.users.hasMany(db.followings, { foreignkey: "userId" });
db.followings.belongsTo(db.users, {
  as: "follower",
  foreignkey: "followerId",
});

//User and Stories relation
db.users.hasMany(db.stories, { foreignkey: "userId" });
db.stories.belongsTo(db.users, { foreignkey: "userId" });

module.exports = db;
