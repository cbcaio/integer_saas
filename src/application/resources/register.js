const express = require('express');

const router = express.Router();
const registerUser = require('../../services/registerUser');

function validateRequest(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username) {
      throw new Error('username is required');
    }

    if (!password) {
      throw new Error('password is required');
    }

    next();
  } catch (e) {
    next(e);
  }
}

router.post('/register', validateRequest, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userId = await registerUser(username, password);

    res.status(201).json({ userId });
  } catch (e) {
    if (e.message === 'User already exists') {
      res.status(409).json({ message: e.message });
    } else {
      next(e);
    }
  }
});

module.exports = router;
