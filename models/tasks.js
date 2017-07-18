
module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define('tasks', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }
);

  return Task;
};
