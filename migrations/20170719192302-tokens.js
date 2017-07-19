const tableName = 'tokens';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        token: {
          type: Sequelize.STRING,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      })
      .then(() => queryInterface.addIndex(tableName, ['userId'], { indexName: 't_type_user', indicesType: 'UNIQUE' })),
  down: queryInterface =>
    queryInterface.dropTable(tableName, { cascade: true, truncate: true })
};
