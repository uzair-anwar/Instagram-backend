module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    caption: { type: Sequelize.STRING },
  });
  return Post;
};
