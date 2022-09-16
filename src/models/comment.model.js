module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    body: { type: Sequelize.STRING, allowNull: false },
  });
  return Comment;
};
