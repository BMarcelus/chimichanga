const tableName = 'tokens';

module.exports = (sequelize, Sequelize) =>
  sequelize.define(tableName, {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: Sequelize.STRING,
      unique: true,
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
  }, {
    indexes: [
      {
        unique: true,
        fields: ['user']
      }
    ]
  });
