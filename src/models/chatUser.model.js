module.exports = (sequelize, Sequelize) => {
  const chatUser = sequelize.define("chatuser", {
    userId: {
      type: Sequelize.STRING(300),
      allowNull: false,
      unique: true,
    },
    socketId: {
      type: Sequelize.STRING(300),
      allowNull: false,
    },
  });
  return chatUser;
};
