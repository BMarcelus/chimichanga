const express = require('express');
const router = express.Router();
const jwt = require('../libs/jwt');
const ac = require('../libs/accesscontrol');

/* GET home page. */
router.get('/', jwt.authenticate, (req, res) => {
  const permission = ac.can(req.user.role).readAny('task');
  res.json(permission);
});

module.exports = router;
