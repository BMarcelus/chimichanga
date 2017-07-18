const nconf = require('nconf');
const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');

const jwtConfig = nconf.get('jwt');
const cookieConfig = nconf.get('cookieConfig');
const models = require('../models');
const { errorCodes } = require('./error');

const UserModel = models.Users;

/**
 * Generate a JWT from an object
 * @param {Object} obj - The object payload of the JWT
 * @param {Object} [options] - JWT options to sign with
 * @returns {String} - signed JWT token
 */
exports.generateToken = (obj, options = null) => {
  let jwtOptions = {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };

  if (options) {
    jwtOptions = Object.assign({}, jwtOptions, options);
  }

  const token = jwt.sign(
    obj,
    jwtConfig.secret,
    jwtOptions
  );

  return token;
};

/**
 * Authentications for JWTs, express middleware
 */
exports.authenticate = (req, res, next) => {
  const jwtOptions = {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };

  let mechanism = null;
  let token = null;
  const authHeader = req.get('Authorization');

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    if (!authHeader) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        error: errorCodes.JWT_MISSING_HEADER
      });
      return;
    }

    [mechanism, token] = authHeader.split(' ');
    if (mechanism !== 'JWT') {
      res.status(HTTPStatus.UNAUTHORIZED).json({
        error: errorCodes.JWT_INVALID_HEADER
      });
      return;
    }
  }

  jwt.verify(token, jwtConfig.secret, jwtOptions, (err, payload) => {
    if (err) {
      res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.JWT_INVALID });
      return;
    }

    UserModel.findOne({
      where: {
        id: payload.id
      }
    })
      .then((user) => {
        if (!user) {
          res.status(HTTPStatus.UNAUTHORIZED).json({
            error: errorCodes.JWT_UNAUTHORIZED
          });
          return;
        }
        req.user = user; // eslint-disable-line
        next();
      })
      .catch((err2) => {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
          error: {
            code: 0,
            message: err2.message,
          }
        });
      });
  });
};

/**
 * Used to verify if current session is valid
 */
exports.hasValidSession = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    const jwtOptions = {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    };
    jwt.verify(token, jwtConfig.secret, jwtOptions, (err) => {
      if (err) { // Invalid jwt
        res.clearCookie(cookieConfig.name);
        res.status(HTTPStatus.UNAUTHORIZED).json({ error: errorCodes.JWT_INVALID });
        return;
      }
      res.status(HTTPStatus.OK).json({ location: '/dashboard' });
    });
    return;
  }
  next();
};
