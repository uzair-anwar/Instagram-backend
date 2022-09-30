module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define("chat", {
    text: { type: Sequelize.STRING, allowNull: false },
  });
  return Chat;
};
