module.exports = (sequelize, Sequelize) => {
  const Code = sequelize.define("code", {
    code: { type: Sequelize.INTEGER, allowNull: false },
    isApplied: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Code;
};
