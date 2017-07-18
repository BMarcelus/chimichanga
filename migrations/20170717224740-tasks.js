const tableName = 'tasks';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      }
    ),
  down: queryInterface =>
    queryInterface.dropTable(tableName, { cascade: true, truncate: true })
};
