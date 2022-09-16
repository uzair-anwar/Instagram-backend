module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define("image", {
    url: { type: Sequelize.STRING },
  });
  return Image;
};
