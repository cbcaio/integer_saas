const express = require('express');

const router = express.Router();
const { registerUser } = require('../../services');

router.post(
  '/register',
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
  },
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const result = await registerUser(username, password);

      res.status(201).json(result);
    } catch (e) {
      if (e.message === 'User already exists') {
        res.status(409).json({ message: e.message });
        return;
      }

      next(e);
    }
  }
);

module.exports = router;
