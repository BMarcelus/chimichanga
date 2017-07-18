const passwordUtils = require('../libs/password');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: Sequelize.STRING(72),
      defaultValue: '',
      validate: {
        notEmpty: {
          msg: 'Password is required and cannot be empty',
        },
      },
      set(val) {
        this.setDataValue('password', passwordUtils.hashPassword(val));
      },
    },
    role: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }, {
    instanceMethods: {
      comparePassword(password) {
        const that = this;
        return passwordUtils.comparePassword(password.trim(), that.password);
      },
      toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
      }
    },
    classMethods: {
      associate: (models) => {
      }
    }
  }
);

  return User;
};
