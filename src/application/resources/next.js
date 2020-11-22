const express = require('express');
const { identifierServices } = require('../../services');

const router = express.Router();

router.get('/next', async (req, res, next) => {
  try {
    const userId = req.authenticatedUser.id;

    const currentIdentifier = await identifierServices.getNextIdentifier(
      userId
    );

    res.status(200).json({ identifier: currentIdentifier });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
