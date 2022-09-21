module.exports = (sequelize, Sequelize) => {
  const Story = sequelize.define("story", {
    url: { type: Sequelize.STRING },
  });
  return Story;
};
