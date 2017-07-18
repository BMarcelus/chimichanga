const errorCodes = {
  SERVER_ISSUE: {
    code: 0,
    message: 'Server issue occurred',
  },
  MISSING_PASSWORD: {
    code: 102,
    message: 'Missing field "password"',
  },
  MISSING_EMAIL: {
    code: 104,
    message: 'Missing email',
  },
  USER_EMAIL_TAKEN: {
    code: 200,
    message: 'Email already taken',
  },
  USER_NOT_FOUND: {
    code: 201,
    message: 'User was not found',
  },
  USER_INVALID_CREDENTIALS: {
    code: 202,
    message: 'Invalid credentials were provided',
  },
  USER_INVALID_EMAIL: {
    code: 203,
    message: 'Invalid email provided',
  },
  USER_RESET_TOKEN_NOT_FOUND: {
    code: 205,
    message: 'User reset token not found',
  },
  JWT_MISSING_HEADER: {
    code: 300,
    message: 'Missing authorization header',
  },
  JWT_INVALID_HEADER: {
    code: 301,
    message: 'Invalid authorization header'
  },
  JWT_INVALID: {
    code: 302,
    message: 'Invalid JWT token',
  },
  JWT_UNAUTHORIZED: {
    code: 303,
    message: 'Token does not belong to a user',
  }
};

module.exports = {
  errorCodes
};
