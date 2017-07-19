const express = require('express');
const router = express.Router();
const models = require('../models');
const HTTPStatus = require('http-status');
const errorCodes = require('../libs/error');
const jwt = require('../libs/jwt');
const nconf = require('nconf');
const emailUtils = require('../libs/email');
const uuidV4 = require('uuid/v4');

const cookieConfig = nconf.get('cookieConfig');
const UserModel = models.Users;
const sequelize = models.sequelize;
const TokenModel = models.Tokens;

const handleSequelizeErrors = (err) => {
  console.log(err);
  return { status: HTTPStatus.INTERNAL_SERVER_ERROR, error: err};
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  const query = `SELECT * FROM "users"`;
  sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      // const errorRes = handleSequelizeErrors(err);
      // res.status(errorRes.status).send(errorRes.error);
      res.send(err);
    });
});

router.post('/', (req, res) => {
  const body = {
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password.trim(),
    role: req.body.role.trim()
  };
  UserModel.create(body)
  .then((user) => {
    const userObj = user.toJSON();
    const token = jwt.generateToken(userObj);
    userObj.jwt = token;
    res.cookie(cookieConfig.name, token);
    res.status(HTTPStatus.CREATED).json({ data: userObj });
    })
    .catch((err) => {
      // const errorObj = handleSequelizeErrors(err);
      // res.status(errorObj.status).json({ error: errorObj.error });
      res.send(err);
    });
});

router.post('/login', (req, res) => {

  const email = (req.body.email || '').trim().toLowerCase();
  const password = (req.body.password || '').trim();
  const remember = req.body.remember;

  if (!email) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
    return;
  }
  if (!password) {
    res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_PASSWORD });
    return;
  }
  const where = {
    email,
  };

  UserModel.findOne({ where })
    .then((user) => {
      if (!user) {
        res.status(HTTPStatus.NOT_FOUND).json({ error: errorCodes.USER_NOT_FOUND });
        return;
      }

      if (!user.comparePassword(password)) {
        res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.USER_INVALID_CREDENTIALS });
        return;
      }
      const userObj = user.toJSON();
      const userJwt = jwt.generateToken(userObj);
      userObj.jwt = userJwt;
      if (remember) {
        res.cookie(cookieConfig.name, userJwt, cookieConfig.options);
      } else {
        res.cookie(cookieConfig.name, userJwt);
      }
      res.status(HTTPStatus.OK).json({ data: userObj });
    })
    .catch((err) => {
      // const errorObj = handleSequelizeErrors(err);
      // res.status(errorObj.status).json({ error: errorObj.error });
      console.log(err);
      res.send(err);
    });
});

router.post('/reset', (req, res) => {
    const email = (req.body.email || '').trim();
    if (!email) {
      res.status(HTTPStatus.BAD_REQUEST).json({ error: errorCodes.MISSING_EMAIL });
      return;
    }
    const where = {
      email: email.toLowerCase()
    }
    UserModel.findOne({ where })
    .then((user) => {
      if (!user) {
        res.status(HTTPStatus.NOT_FOUND).json({ error: errorCodes.USER_NOT_FOUND });
        return;
      }
      const token = uuidV4();
      TokenModel.upsert({ userId: user.id, token })
        .then(() => {
          res.status(HTTPStatus.OK).end();
          // const resetUrl = `${req.protocol}://${req.get('host')}/user/reset/${token}`;
          // const emailData = { user, resetUrl };
          // emailUtils.sendEmail(user.email, 'passwordReset', emailData, emails.resetPassword.subject)
      //       .catch((err) => {
      //         console.log(err);
      //       });
        })
        .catch((error) => {
          const errorObj = handleSequelizeErrors(error);
          res.status(errorObj.status).json({ error: errorObj.error });
        });
    })
    .catch((error) => {
      const errorObj = handleSequelizeErrors(error);
      res.status(errorObj.status).json({ error: errorObj.error });
    });
})

module.exports = router;
