const Sequelize = require('sequelize');
const nconf = require('nconf');

const postgresConfig = nconf.get('postgres');

const sequelize = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  postgresConfig.options
);

const db = {
  sequelize,
  Sequelize,
  Users: sequelize.import('./users'),
  Tasks: sequelize.import('./tasks'),
  Tokens: sequelize.import('./tokens'),
};



module.exports = db;
