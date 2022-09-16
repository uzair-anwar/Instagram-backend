module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
<<<<<<< HEAD
    body: { type: Sequelize.STRING, allowNull: false },
=======
    body: { type: Sequelize.STRING },
>>>>>>> Completed get, create and delete a comment feature
  });
  return Comment;
};
