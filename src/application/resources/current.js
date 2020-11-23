const express = require('express');

const router = express.Router();
const { identifierServices } = require('../../services');

router.get('/current', async (req, res, next) => {
  try {
    const userId = req.authenticatedUser.id;

    const currentIdentifier = await identifierServices.getCurrentUserIdenfifier(
      userId
    );

    res.status(200).json({ identifier: currentIdentifier });
  } catch (e) {
    next(e);
  }
});

router.put(
  '/current',
  function validateRequest(req, res, next) {
    try {
      const { current } = req.body;

      if (!current) {
        throw new Error('current is required');
      }

      if (!Number.isInteger(current) || current < 0) {
        throw new Error('current value must be a positive integer');
      }

      next();
    } catch (e) {
      next(e);
    }
  },
  async (req, res, next) => {
    try {
      const userId = req.authenticatedUser.id;
      const { current } = req.body;

      const currentIdentifier = await identifierServices.setCurrentUserIdenfifier(
        userId,
        current
      );

      res.status(200).json({ identifier: currentIdentifier });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
